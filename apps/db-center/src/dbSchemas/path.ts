import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const paths = sqliteTable("path", {
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
  type: integer("type").notNull(),
});
