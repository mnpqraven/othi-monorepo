import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { blogs } from "../blog";
import { medias } from "./media";

export const blogMediaBinds = sqliteTable("blog_mediaBind", {
  blogId: text("blog_id")
    .references(() => blogs.id, { onDelete: "cascade" })
    .notNull(),
  mediaId: text("media_id")
    .references(() => medias.id, { onDelete: "cascade" })
    .notNull(),
});
