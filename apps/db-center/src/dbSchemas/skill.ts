import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { skillTypes } from "./skillType";

export const skills = sqliteTable("skill", {
  id: int("id").primaryKey(),
  name: text("name"),
  tag: text("tag"),
  typeDesc: text("type_desc"),
  maxLevel: int("max_level"),
  spGain: int("spbase"),
  spNeed: int("spneed"),
  attackType: text("attack_type").references(() => skillTypes.name),
});
