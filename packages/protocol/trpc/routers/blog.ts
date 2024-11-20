/* eslint-disable no-console */
import TurndownService from "turndown";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import {
  blogs,
  blogsAndTags,
  insertBlogSchema,
  medias,
  selectBlogSchema,
} from "database/schema";
import { eq, isNull } from "drizzle-orm";
import { db, LibsqlError } from "database";
import { remark } from "remark";
import html from "remark-html";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateUlid } from "lib";
import { revalidatePath } from "next/cache";
import { utapi } from "../../server/uploadthing";
import {
  authedProcedure,
  publicProcedure,
  router,
  superAdminProcedure,
} from "../trpc";

async function getBlogs() {
  const start = performance.now();
  const query = await db.query.blogs.findMany({
    orderBy({ createdAt }, op) {
      return [op.desc(createdAt)];
    },
    columns: { createdAt: true, title: true, id: true, publish: true },
  });
  const end = performance.now();
  console.log(`GET ALL BLOGS: ${end - start} MS`);
  return query;
}

async function getBlog({
  id,
  tags = false,
}: Pick<z.TypeOf<typeof selectBlogSchema>, "id"> & { tags?: boolean }) {
  const start = performance.now();
  if (tags) {
    const query = await db.query.blogs.findFirst({
      where: ({ id: blogId }, op) => op.eq(blogId, id),
      with: { blogsAndTags: { with: { tag: true } } },
    });
    if (!query) return undefined;
    const { blogsAndTags: _tags, ...rest } = query;
    return { tags: _tags.map((e) => e.tag), ...rest };
  }

  const query = await db.query.blogs.findFirst({
    where: ({ id: _id }, opt) => opt.eq(_id, id),
  });
  const end = performance.now();
  console.log(`GET BLOG BY ID: ${end - start} MS`);
  return query;
}

/**
 * converts a html string into a markdown string
 *
 * does not communicate with any db, only sanitize and string transformation
 */
function convertToMD(htmlString: string) {
  // SANITIZATION
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  const clean = DOMPurify.sanitize(htmlString);

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(clean);

  return markdown;
}

async function createMarkdownFile(input: {
  markdownString: string;
  title?: string;
  tempBlogId?: string;
}) {
  // unix time
  const unix = new Date().getTime();
  const fileName = `${unix}.md`;
  const blob = new Blob([input.markdownString]);

  const response = await utapi.uploadFiles([new File([blob], fileName)]);

  console.log("UPLOAD RESPONSE", response);
  return response.map((e) => e.data).at(0);
}

async function updateMarkdownFile(input: {
  markdownString: string;
  oldFileKey: string;
}) {
  console.log("updating md file");
  const { markdownString, oldFileKey } = input;
  const unix = new Date().getTime();
  const fileName = `${unix}.md`;
  const blob = new Blob([markdownString]);

  console.log("deleting", oldFileKey);
  const _deletion = await utapi.deleteFiles([oldFileKey]);
  console.log("deleted", _deletion);

  const upload = await utapi.uploadFiles([new File([blob], fileName)]);
  const res = upload.at(0);

  console.log("uploaded", res);

  if (!res?.data) {
    console.log("error encountered", res?.error);
    return undefined;
  }
  const { key, name, url } = res.data;
  return { fileName: name, fileKey: key, mdUrl: url };
}

const createMetaSchema = insertBlogSchema.pick({
  title: true,
  mdUrl: true,
  fileName: true,
  fileKey: true,
});
async function createMeta(input: z.TypeOf<typeof createMetaSchema>) {
  const { title, mdUrl, fileName, fileKey } = input;
  const metaReq = await db
    .insert(blogs)
    .values({
      id: generateUlid(),
      title,
      mdUrl,
      fileName,
      fileKey,
    })
    .returning();
  return metaReq.at(0);
}

const updateParamSchema = insertBlogSchema.partial().required({ id: true });
async function updateMeta(input: z.TypeOf<typeof updateParamSchema>) {
  try {
    const { id: blogId, ...rest } = input;

    if (rest.mdUrl) revalidatePath(rest.mdUrl);

    return db
      .update(blogs)
      .set({ ...rest })
      .where(eq(blogs.id, blogId))
      .returning();
  } catch (e) {
    const message =
      e instanceof LibsqlError
        ? e.message
        : "undefined message, server-side debug needed";
    throw new TRPCError({ code: "FORBIDDEN", message });
  }
}

/**
 * insert entry in the bind table (which blog has which tag)
 */
async function createTagsBinds(input: { blogId: string; tags: string[] }) {
  const values = input.tags.map((tagCode) => ({
    blogId: input.blogId,
    tagCode,
  }));
  await db.insert(blogsAndTags).values(values);
}

async function updateTags(input: { blogId: string; tags: string[] }) {
  // delete all involving tags then re-insert
  const insertValues = input.tags.map((e) => ({
    blogId: input.blogId,
    tagCode: e,
  }));
  const _batchQuery = await db.batch([
    db.delete(blogsAndTags).where(eq(blogsAndTags.blogId, input.blogId)),
    db.insert(blogsAndTags).values(insertValues),
  ]);
}

const updateBlogSchema = z.object({
  blogId: z.string(),
  title: z.string(),
  htmlString: z.string(),
  tags: z.string().array().optional(),
});
async function updateBlog({
  blogId,
  htmlString,
  title,
  tags,
}: z.TypeOf<typeof updateBlogSchema>) {
  const oldFileKey = (await getBlog({ id: blogId }))?.fileKey;
  if (!oldFileKey)
    return { success: false as const, error: "current meta null" };

  if (tags) void updateTags({ blogId, tags });

  const markdownString = convertToMD(htmlString);
  const mdBlob = await updateMarkdownFile({
    markdownString,
    oldFileKey,
  });

  if (!mdBlob) return { success: false as const, error: "updatedMD is null" };

  const { fileKey, fileName, mdUrl } = mdBlob;
  const updatedMeta = await updateMeta({
    id: blogId,
    title,
    fileKey,
    fileName,
    mdUrl,
  });
  // TODO: media
  return { success: true as const, data: updatedMeta.at(0) };
}

const createBlogSchema = z.object({
  tempBlogId: z.string(),
  title: z.string(),
  htmlString: z.string(),
  tags: z.string().array().optional(),
});
async function createBlog({
  tempBlogId,
  htmlString,
  title,
  tags,
}: z.TypeOf<typeof createBlogSchema>) {
  const markdownString = convertToMD(htmlString);
  const mdBlob = await createMarkdownFile({
    markdownString,
    tempBlogId,
    title,
  });

  if (!mdBlob) return { success: false as const, error: "updatedMD is null" };

  const { name, url, key } = mdBlob;
  const createdMeta = await createMeta({
    title,
    fileKey: key,
    fileName: name,
    mdUrl: url,
  });
  if (tags && createdMeta)
    await createTagsBinds({ blogId: createdMeta.id, tags });
  // TODO: media
  return { success: true as const, data: createdMeta };
}

export const blogRouter = router({
  listMeta: publicProcedure
    // TODO: input
    .query(async () => {
      // BUG: this breaks build
      // const cacheFn = cache(getBlogs, ["blogs"]);
      const res = await getBlogs();
      return res;
    }),
  byId: publicProcedure
    .input(
      selectBlogSchema
        .pick({ id: true })
        .extend({ tags: z.boolean().optional().default(false) }),
    )
    .query(async ({ input }) => {
      const { id, tags } = input;
      // BUG: this breaks build
      // const query = cache(getBlogById, ["blog", id]);
      const meta = await getBlog({ id, tags });

      if (meta) {
        const fileContents = await fetch(meta.mdUrl, {
          cache: "force-cache",
        }).then((data) => data.text());

        // convert markdown into HTML string
        const dataPipe = await remark().use(html).process(fileContents);
        const contentHtml = dataPipe.toString();

        return { meta, contentHtml };
      }

      return undefined;
    }),
  create: {
    everything: superAdminProcedure
      .input(createBlogSchema)
      .mutation(({ input }) => createBlog(input)),
    meta: superAdminProcedure
      .input(createMetaSchema)
      .mutation(({ input }) => createMeta(input)),
    /**
     * uploads a markdown file to UT bucket
     */
    markdownFile: authedProcedure
      .input(
        z.object({
          markdownString: z.string(),
          tempBlogId: z.string().optional(),
          title: z.string().optional(),
        }),
      )
      .mutation(({ input }) => createMarkdownFile(input)),
  },
  update: {
    everything: superAdminProcedure
      .input(updateBlogSchema)
      .mutation(({ input }) => updateBlog(input)),
    meta: superAdminProcedure
      .input(updateParamSchema)
      .mutation(({ input }) => updateMeta(input)),
    /**
     * this replaces a markdown file on UT by uploading the new file and delete the old file
     */
    markdownFile: superAdminProcedure
      .input(z.object({ markdownString: z.string(), oldFileKey: z.string() }))
      .mutation(({ input }) => updateMarkdownFile(input)),
    tags: superAdminProcedure
      .input(z.object({ blogId: z.string(), tags: z.string().array() }))
      .mutation(({ input }) => updateTags(input)),
  },
  /**
   * converts a html string into a markdown string
   *
   * does not communicate with any db, only sanitize and string transformation
   */
  convertToMD: superAdminProcedure
    .input(z.object({ htmlString: z.string() }))
    .mutation(({ input }) => convertToMD(input.htmlString)),
  tempImage: {
    /**
     * promote a temp image from draft status
     */
    promote: superAdminProcedure
      .input(z.object({ tempBlogId: z.string(), blogId: z.string() }))
      .mutation(async ({ input }) => {
        const { blogId, tempBlogId } = input;
        const st = await db
          .update(medias)
          .set({ blogId })
          .where(eq(medias.tempBlogId, tempBlogId));

        console.log(st);
        return { wip: true };
      }),
    /**
     * uploads a draft image meta to local db + UT
     */
    append: superAdminProcedure
      .input(
        z.object({
          tempBlogId: z.string(),
          files: z
            .custom<File>()
            .array()
            .describe(
              "This doesn't actually mean multiple files, just that the file argument is always an array",
            ),
        }),
      )
      .mutation(async ({ input }) => {
        // NOTE: upload to UT
        const _responses = await Promise.all(
          input.files.map(async (_file) => {
            const unix = new Date().getTime();
            const file = new File([_file], `${unix}-${_file.name}`, {
              type: _file.type,
            });
            const req = await utapi.uploadFiles(file);
            return req;
          }),
        );

        // valid responses
        const validResponses = _responses
          .map((e) => e.data)
          .filter((e) => e !== null);
        const invalidResponses = _responses.filter((e) => e.data === null);

        // NOTE: upload meta to db

        const _metaRes = await Promise.all(
          validResponses.map(async ({ name, url }) => {
            const req = await db
              .insert(medias)
              .values({
                fileName: name,
                mediaUrl: url,
                tempBlogId: input.tempBlogId,
              })
              .returning();
            return req;
          }),
        );

        console.log({
          success: _metaRes,
          errored: invalidResponses,
        });
        return { wip: true };
      }),
    /**
     * delete all images not attached to a blog
     */
    clear: superAdminProcedure.mutation(async () => {
      await db.delete(medias).where(isNull(medias.blogId));
    }),
  },
  tag: {
    list: publicProcedure
      // TODO: input
      // also querying blog content or not
      .query(async () => {
        const query = await db.query.blogTags.findMany();
        return query;
      }),
  },
});
