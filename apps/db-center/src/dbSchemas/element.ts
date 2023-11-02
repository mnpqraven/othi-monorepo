import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ELEMENTS = [
  "Fire",
  "Ice",
  "Physical",
  "Wind",
  "Lightning",
  "Quantum",
  "Imaginary",
] as const;

export const elements = sqliteTable("element", {
  name: text("name", {
    enum: ELEMENTS,
  }).primaryKey(),
  type: int("type").notNull(),
});
