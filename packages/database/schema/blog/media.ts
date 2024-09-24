import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const medias = sqliteTable("medias", {
  tempBlogId: text("temp_blog_id").primaryKey(),
  fileName: text("file_name").notNull(),
  mediaUrl: text("media_url").notNull(),
});
