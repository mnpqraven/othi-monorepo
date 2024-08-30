import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulid";

export const blogs = sqliteTable("blogs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertBlogSchema = createInsertSchema(blogs, {
  name: (schema) =>
    schema.name.min(1, {
      message: "Blog title must be at least 1 character long",
    }),
  content: (schema) =>
    schema.content.min(1, {
      message: "Blog content must be at least 1 character long",
    }),
});

export type Blog = typeof blogs.$inferSelect;
export type BlogInsert = typeof blogs.$inferInsert;

export const blogTags = sqliteTable("blog_tag", {
  code: text("code").primaryKey().notNull(),
  label: text("label", { length: 256 }).notNull(),
});

export const insertBlogTagSchema = createInsertSchema(blogTags, {
  code: (schema) => schema.code.min(1),
  label: (schema) => schema.code.min(1),
});

export type BlogTag = typeof blogTags.$inferSelect;
