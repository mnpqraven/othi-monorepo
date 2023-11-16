import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { items } from "./item";
import { avatars } from "./avatar";
import { relations } from "drizzle-orm";

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
  pointId: int("point_id").primaryKey(),
  maxLevel: int("max_level"),
  avatarId: int("avatar_id").references(() => avatars.id),
  // CORE = 2 | SMALL = 1 | BIG = 3
  pointType: int("point_type"),
  anchor: text("anchor", { enum: ANCHORS }),
  defaultUnlock: int("default_unlock", { mode: "boolean" }),
  prePoint: text("pre_point", { mode: "json" }).$type<{ list: number[] }>(),
  statusAddList: text("status_add_list", { mode: "json" }).$type<{
    propertyType: string;
    value: number;
  }>(),
  avatarPromotionLimit: text("avatar_promotion_limit", { mode: "json" }).$type<
    number[]
  >(),
  pointName: text("point_name"),
  pointDesc: text("point_desc", { mode: "json" }).$type<{ list: string[] }>(),
  paramList: text("param_list", { mode: "json" }).$type<{ list: string[][] }>(),
});

export const traceRelations = relations(traces, ({ one }) => ({
  avatar: one(avatars, {
    fields: [traces.avatarId],
    references: [avatars.id],
  }),
}));

export const traceItem = sqliteTable(
  "honkai_traceMaterial",
  {
    pointId: int("point_id").references(() => traces.pointId, {
      onDelete: "cascade",
    }),
    level: int("level"),
    itemId: int("item_id").references(() => items.id),
    amount: int("item_amount"),
  },
  (t) => ({
    primaryKey: primaryKey(t.pointId, t.level, t.itemId),
  }),
);

export const traceItemRelations = relations(traceItem, ({ one }) => ({
  trace: one(traces, {
    fields: [traceItem.pointId],
    references: [traces.pointId],
  }),
  item: one(items, {
    fields: [traceItem.itemId],
    references: [items.id],
  }),
}));
