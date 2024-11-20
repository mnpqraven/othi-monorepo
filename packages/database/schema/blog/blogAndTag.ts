import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { blogs, blogTags } from "./blog";

export const blogsAndTags = sqliteTable("blogTagMapping", {
  blogId: text("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  tagCode: text("tag_code")
    .notNull()
    .references(() => blogTags.code, {
      onDelete: "cascade",
    }),
});

export const blogsRelations = relations(blogs, ({ many }) => ({
  blogsAndTags: many(blogsAndTags, {
    relationName: "blogRelation",
  }),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  blogs: many(blogsAndTags, {
    relationName: "tagRelation",
  }),
}));

export const blogsAndTagsRelations = relations(blogsAndTags, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogsAndTags.blogId],
    references: [blogs.id],
    relationName: "blogRelation",
  }),
  tag: one(blogTags, {
    fields: [blogsAndTags.tagCode],
    references: [blogTags.code],
    relationName: "tagRelation",
  }),
}));
