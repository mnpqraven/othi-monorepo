/* eslint-disable no-console */
import TurndownService from "turndown";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import {
  blogs,
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
import { utapi } from "../server/uploadthing";
import {
  authedProcedure,
  publicProcedure,
  router,
  superAdminProcedure,
} from "./trpc";
// import { cache } from "./react/server";

async function getBlogs() {
  const start = performance.now();
  const query = await db.query.blogs.findMany({
    orderBy({ createdAt }, op) {
      return [op.desc(createdAt)];
    },
    columns: { createdAt: true, title: true, id: true },
  });
  const end = performance.now();
  console.log(`GET ALL BLOGS: ${end - start} MS`);
  return query;
}

async function getBlogById({
  id,
}: Pick<z.TypeOf<typeof selectBlogSchema>, "id">) {
  const start = performance.now();
  const query = await db.query.blogs.findFirst({
    where: ({ id: _id }, opt) => opt.eq(_id, id),
  });
  const end = performance.now();
  console.log(`GET BLOG BY ID: ${end - start} MS`);
  return query;
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
    .input(selectBlogSchema.pick({ id: true }))
    .query(async ({ input }) => {
      const { id } = input;
      // BUG: this breaks build
      // const query = cache(getBlogById, ["blog", id]);
      const meta = await getBlogById({ id });

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
    meta: authedProcedure
      .input(
        insertBlogSchema.pick({
          title: true,
          mdUrl: true,
          fileName: true,
          fileKey: true,
        }),
      )
      .mutation(async ({ input }) => {
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
        return { data: metaReq.at(0) };
      }),
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
      .mutation(async ({ input }) => {
        // unix time
        const unix = new Date().getTime();
        const fileName = `${unix}.md`;
        const blob = new Blob([input.markdownString]);

        const response = await utapi.uploadFiles([new File([blob], fileName)]);

        console.log("UPLOAD RESPONSE", response);
        return response.map((e) => e.data).at(0);
      }),
  },
  update: {
    meta: superAdminProcedure
      .input(insertBlogSchema.partial().required({ id: true }))
      .mutation(async ({ input }) => {
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
      }),
    /**
     * this replaces a markdown file on UT by uploading the new file and delete the old file
     */
    markdownFile: superAdminProcedure
      .input(
        z.object({
          markdownString: z.string(),
          oldFileKey: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
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
      }),
  },
  /**
   * this converts a html string into a markdown string
   *
   * does not communicate with any db, only sanitize and string transformation
   */
  convertToMD: authedProcedure
    .input(
      z.object({
        htmlString: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // SANITIZATION
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window);
      const clean = DOMPurify.sanitize(input.htmlString);

      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(clean);

      return markdown;
    }),

  tempImage: {
    /**
     * promote a temp image from draft status
     */
    promote: authedProcedure
      .input(
        z.object({
          tempBlogId: z.string(),
          blogId: z.string(),
        }),
      )
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
    append: authedProcedure
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
    clear: authedProcedure.mutation(async () => {
      await db.delete(medias).where(isNull(medias.blogId));
    }),
  },
});
