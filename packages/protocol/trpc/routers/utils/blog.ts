/* eslint-disable no-console */
import { z } from "zod";
import TurndownService from "turndown";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { authedProcedure, router } from "../../trpc";
import { utapi } from "../../../server/uploadthing";

export const blogRouter = router({
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
  uploadMarkdown: authedProcedure
    .input(
      z.object({
        markdownString: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // unix time
      const unix = new Date().getTime();
      const fileName = `${unix}.md`;

      const blob = new Blob([input.markdownString]);

      const response = await utapi.uploadFiles([new File([blob], fileName)]);

      console.log("UPLOAD RESPONSE", response);

      return { success: true };
    }),
  uploadTempImage: authedProcedure.mutation(() => {
    // TODO: uploadTempImage
    return { success: true };
  }),
});
