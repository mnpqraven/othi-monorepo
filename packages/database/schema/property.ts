import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("honkai_property", {
  type: text("type").primaryKey(),
  name: text("name").notNull(),
  skillTreeDesc: text("skill_tree_desc"),
  relicDesc: text("relic_desc"),
  filterDesc: text("filter_desc"),
  main_relic_filter: int("main_relic_filter"),
  sub_relic_filter: int("sub_relic_filter"),
  property_classify: int("property_classify"),
  isDisplay: int("is_display", { mode: "boolean" }),
  isBattleDisplay: int("is_battle_display", { mode: "boolean" }),
  order: int("order"),
});
