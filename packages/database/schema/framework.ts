import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const frameworks = sqliteTable(
  "frameworks",
  {
    id: int("id").primaryKey(),
    name: text("name", { length: 255 }).notNull(),
    language: text("language").notNull(),
    url: text("url"),
    stars: int("stars"),
  },
  (frameworks) => ({
    nameIdx: uniqueIndex("idx_frameworks_name").on(frameworks.name),
    urlIdx: uniqueIndex("idx_frameworks_url").on(frameworks.url),
  })
);

export type Framework = InferSelectModel<typeof frameworks>;
export type FrameworkInsert = InferInsertModel<typeof frameworks>;
