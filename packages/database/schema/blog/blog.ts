import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const blogs = sqliteTable("blogs", {
  id: text("blog_id").primaryKey(),
  title: text("title", { length: 256 }).notNull(),
  fileName: text("fileName", { length: 256 }).notNull(),
  mdUrl: text("md_url").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertBlogSchema = createInsertSchema(blogs, {
  title: (schema) =>
    schema.title.min(1, {
      message: "Blog title must be at least 1 character long",
    }),
});
export const selectBlogSchema = createSelectSchema(blogs);

export type Blog = typeof blogs.$inferSelect;
export type BlogInsert = typeof blogs.$inferInsert;

export const blogTags = sqliteTable("blog_tag", {
  code: text("code").primaryKey().notNull(),
  label: text("label", { length: 256 }).notNull(),
});

export const insertBlogTagSchema = createInsertSchema(blogTags, {
  code: (schema) => schema.code.min(1, { message: "code is required" }),
  label: (schema) => schema.code.min(1, { message: "label is required" }),
});

export type BlogTag = typeof blogTags.$inferSelect;
