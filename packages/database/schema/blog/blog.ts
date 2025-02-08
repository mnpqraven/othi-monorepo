import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const blogs = sqliteTable("blogs", {
  id: text("blog_id").primaryKey(),
  title: text("title", { length: 256 }).notNull(),
  fileName: text("file_name", { length: 256 }).notNull(),
  fileKey: text("file_key", { length: 256 }).notNull(),
  publish: int("publish", { mode: "boolean" }).default(false),
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
    schema.min(1, {
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
  code: (schema) => schema.min(1, { message: "Required" }),
  label: (schema) => schema.min(1, { message: "Required" }),
});

export type BlogTag = typeof blogTags.$inferSelect;
