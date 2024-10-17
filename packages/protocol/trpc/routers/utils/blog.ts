/* eslint-disable no-console */

import { z } from "zod";
import TurndownService from "turndown";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { db } from "database";
import { blogs, insertBlogSchema, medias } from "database/schema";
import { generateUlid } from "lib";
import { eq, isNull } from "drizzle-orm";
import { authedProcedure, publicProcedure, router } from "../../trpc";
import { utapi } from "../../../server/uploadthing";

export const blogUtilsRouter = router({
  metaList: publicProcedure
    // TODO:
    // .input
    .query(async () => {
      const res = await db.query.blogs.findMany({
        orderBy: ({ createdAt }, op) => [op.desc(createdAt)],
      });
      return res;
    }),
  convertToMD: authedProcedure
    .input(
      z.object({
        htmlString: z.string(),
      }),
    )
    .mutation(({ input }) => {
      console.log("CONVERT INPUT");
      console.log(input.htmlString);

      // SANITIZATION
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window);
      const clean = DOMPurify.sanitize(input.htmlString);

      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(clean);

      console.log("CONVERT OUTPUT");
      console.log(markdown);
      return markdown;
    }),
  upload: {
    /**
     * upload a blog markdown meta to local db
     */
    blogMeta: authedProcedure
      .input(
        insertBlogSchema.pick({ title: true, mdUrl: true, fileName: true }),
      )
      .mutation(async ({ input }) => {
        const { title, mdUrl, fileName } = input;
        const metaReq = await db
          .insert(blogs)
          .values({
            id: generateUlid(),
            title,
            mdUrl,
            fileName,
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
          tempBlogId: z.string(),
          title: z.string(),
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
    /**
     * promote a temp image from draft status
     */
    promoteTempImage: authedProcedure
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
    tempImage: authedProcedure
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
    clearTempImages: authedProcedure.mutation(async () => {
      await db.delete(medias).where(isNull(medias.blogId));
    }),
  },
  update: {
    blogMeta: authedProcedure
      .input(
        insertBlogSchema.pick({
          id: true,
          mdUrl: true,
          fileName: true,
        }),
      )
      .mutation(async ({ input }) => {
        const { id: blogId, mdUrl, fileName } = input;

        // update meta entry
        const updateReq = await db
          .update(blogs)
          .set({ mdUrl, fileName })
          .where(eq(blogs.id, blogId));

        console.log("updateReq", updateReq);

        return { wip: true };
      }),
    /**
     * updates a markdown file (replace existing MD in UT with a new one)
     */
    markdownFile: authedProcedure
      .input(
        z.object({
          oldFileName: z.string(),
          markdownString: z.string(),
          tempBlogId: z.string(),
          title: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        // unix time
        const unix = new Date().getTime();
        const fileName = `${unix}.md`;
        const blob = new Blob([input.markdownString]);

        const response = await utapi.uploadFiles([new File([blob], fileName)]);

        console.log("UPLOAD RESPONSE", response);

        // if upload succeeds, delete old files
        const delResponse = await utapi.deleteFiles([input.oldFileName]);

        console.log("delResponse", delResponse);

        return response.map((e) => e.data).at(0);
      }),
  },
});
