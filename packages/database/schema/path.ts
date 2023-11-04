import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const paths = sqliteTable("honkai_path", {
  name: text("name", {
    enum: [
      "Destruction",
      "Hunt",
      "Erudition",
      "Harmony",
      "Nihility",
      "Preservation",
      "Abundance",
    ],
  }).primaryKey(),
  type: int("type").notNull(),
});
