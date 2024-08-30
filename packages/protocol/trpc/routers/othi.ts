import { blogs, blogTags, insertBlogSchema } from "database/schema/blog";
import { db } from "database";
import { publicProcedure, router, superAdminProcedure } from "../trpc";

export const othiRouter = router({
  testSuperAdmin: superAdminProcedure.query(() => {
    return "ok";
  }),
  blog: {
    create: superAdminProcedure
      .input(insertBlogSchema)
      .mutation(async ({ input }) => {
        try {
          await db.insert(blogs).values(input);
          return { success: true };
        } catch (_e) {
          return { success: false };
        }
      }),
  },
  blogTag: {
    list: publicProcedure.query(async () => {
      const data = await db.select().from(blogTags);
      return data;
    }),
  },
});
