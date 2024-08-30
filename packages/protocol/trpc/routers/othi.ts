import {
  blogs,
  blogTags,
  insertBlogSchema,
  insertBlogTagSchema,
} from "database/schema/blog";
import { db, LibsqlError } from "database";
import { TRPCError } from "@trpc/server";
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
    create: superAdminProcedure
      .input(insertBlogTagSchema)
      .mutation(async ({ input }) => {
        try {
          return db.insert(blogTags).values(input).returning();
        } catch (e) {
          const message =
            e instanceof LibsqlError
              ? e.message
              : "undefined message, server-side debug needed";
          throw new TRPCError({ code: "FORBIDDEN", message });
        }
      }),
  },
});
