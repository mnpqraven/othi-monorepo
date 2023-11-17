import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import type { Property } from "../types/honkai";
import { ANCHORS } from "../types/honkai";
import { items } from "./item";
import { avatars } from "./avatar";
import { skills } from "./avatarSkill";

export type AvatarTraceSchema = InferSelectModel<typeof traces>;
export const traces = sqliteTable(
  "honkai_trace",
  {
    pointId: int("point_id").primaryKey(),
    maxLevel: int("max_level"),
    avatarId: int("avatar_id").references(() => avatars.id),
    skillId: int("skill_id").references(() => skills.id),
    // CORE = 2 | SMALL = 1 | BIG = 3
    pointType: int("point_type"),
    anchor: text("anchor", { enum: ANCHORS }),
    defaultUnlock: int("default_unlock", { mode: "boolean" }),
    prePoint: text("pre_point", { mode: "json" }).$type<{ list: number[] }>(),
    statusAddList: text("status_add_list", { mode: "json" }).$type<
      { propertyType: Property; value: number }[]
    >(),
    avatarPromotionLimit: text("avatar_promotion_limit", {
      mode: "json",
    }).$type<number[]>(),
    pointName: text("point_name"),
    pointDesc: text("point_desc", { mode: "json" }).$type<string[]>(),
    paramList: text("param_list", { mode: "json" }).$type<string[][]>(),
  },
  (t) => ({
    avatarIdx: index("honkai_avatar_id_idx").on(t.avatarId),
    skillIdx: index("honkai_skill_id_idx").on(t.skillId),
  }),
);

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
