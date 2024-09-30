import { selectBlogSchema } from "database/schema";
import { db } from "database";
import { remark } from "remark";
import html from "remark-html";
import { publicProcedure, router } from "./trpc";

export const blogRouter = router({
  byId: publicProcedure
    .input(selectBlogSchema.pick({ id: true }))
    .query(async ({ input }) => {
      const meta = await db.query.blogs.findFirst({
        where: ({ id }, { eq }) => eq(id, input.id),
      });
      if (meta) {
        const fileContents = await fetch(meta.mdUrl).then((data) =>
          data.text(),
        );

        // convert markdown into HTML string
        const dataPipe = await remark().use(html).process(fileContents);
        const contentHtml = dataPipe.toString();

        return { meta, contentHtml };
      }

      return undefined;
    }),
});
