import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { items } from "./item";

const ANCHORS = [
  "Point01",
  "Point02",
  "Point03",
  "Point04",
  "Point05",
  "Point06",
  "Point07",
  "Point08",
  "Point09",
  "Point10",
  "Point11",
  "Point12",
  "Point13",
  "Point14",
  "Point15",
  "Point16",
  "Point17",
  "Point18",
] as const;

export const traces = sqliteTable("honkai_trace", {
  id: int("id").primaryKey(),
  maxLevel: int("max_level"),
  pointType: int("point_type"),
  anchor: text("anchor", { enum: ANCHORS }),
  defaultUnlock: int("default_unlock", { mode: "boolean" }),
  avatarPromotionLimit: int("avatar_promotion_limit"),
  prePoint: text("pre_point", { mode: "json" }).$type<{ list: number[] }>(),
  pointDesc: text("point_desc", { mode: "json" }).$type<{ list: string[] }>(),
  paramList: text("param_list", { mode: "json" }).$type<{ list: string[][] }>(),
});

export const traceMaterials = sqliteTable("honkai_traceMaterial", {
  requestId: int("request_id").primaryKey({ autoIncrement: true }),
  itemId: int("item_id").references(() => items.id, { onDelete: "set null" }),
  pointId: int("point_id").references(() => traces.id, { onDelete: "cascade" }),
  level: int("level"),
  num: int("item_num"),
});
