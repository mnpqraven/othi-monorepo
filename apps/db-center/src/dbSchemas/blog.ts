import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulid";

export const blogs = sqliteTable("blogs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: int("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const insertBlogSchema = createInsertSchema(blogs, {
  name: (schema) =>
    schema.name.min(1, {
      message: "Blog title must be at least 1 character long",
    }),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
