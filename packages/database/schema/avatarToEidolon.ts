import { InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { avatars } from ".";

export type EidolonSchema = InferSelectModel<typeof eidolons>;
export const eidolons = sqliteTable("honkai_eidolon", {
  id: int("id").primaryKey(),
  rank: int("rank"),
  name: text("name"),
  desc: text("desc", { mode: "json" }).$type<string[]>(),
  unlockCost: text("unlock_cost", { mode: "json" }).$type<{
    item_id: number;
    item_num: number;
  }>(),
  param: text("param", { mode: "json" }).$type<string[]>(),
});

export const eidolonRelations = relations(eidolons, ({ one }) => ({
  avatarToEidolon: one(avatarToEidolons),
}));

export const avatarToEidolons = sqliteTable(
  "honkai_avatarEidolon",
  {
    avatarId: int("avatar_id").references(() => avatars.id, {
      onDelete: "cascade",
    }),
    eidolonId: int("eidolon_id").references(() => eidolons.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({
    pk: primaryKey(t.eidolonId),
    avatarIdx: index("idx_eidolon_avatar_id").on(t.avatarId),
  })
);

export const avatarToEidolonRelations = relations(
  avatarToEidolons,
  ({ one }) => ({
    avatar: one(avatars, {
      fields: [avatarToEidolons.avatarId],
      references: [avatars.id],
    }),
    skill: one(eidolons, {
      fields: [avatarToEidolons.eidolonId],
      references: [eidolons.id],
    }),
  })
);
