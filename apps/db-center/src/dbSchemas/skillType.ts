import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const SKILL_TYPES = [
  "Normal", // basic attack
  "BPSkill", // Skill
  "Ultra", // Ultimate
  "Talent", // Talent
  "MazeNormal", // overworld normal
  "Maze", // overworld Technique
] as const;

export const skillTypes = sqliteTable("skillType", {
  name: text("name", { enum: SKILL_TYPES }).primaryKey(),
  type: int("type").notNull(),
});
