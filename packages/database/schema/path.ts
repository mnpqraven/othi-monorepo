import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const PATHS = [
  "Destruction",
  "Hunt",
  "Erudition",
  "Harmony",
  "Nihility",
  "Preservation",
  "Abundance",
] as const;
export type Path = (typeof PATHS)[number];

export const paths = sqliteTable("honkai_path", {
  name: text("name", {
    enum: PATHS,
  }).primaryKey(),
  type: int("type").notNull(),
});
