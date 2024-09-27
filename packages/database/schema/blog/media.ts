import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { blogs } from "./blog";

export const medias = sqliteTable("medias", {
  tempBlogId: text("temp_blog_id").primaryKey(),
  fileName: text("file_name").notNull(),
  mediaUrl: text("media_url").notNull(),
  blogId: text("blog_id").references(() => blogs.id, { onDelete: "cascade" }),
});
