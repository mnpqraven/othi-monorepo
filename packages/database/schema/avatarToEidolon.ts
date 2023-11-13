import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { avatars } from ".";

export type EidolonSchema = InferSelectModel<typeof eidolons>;
export const eidolons = sqliteTable("honkai_eidolon", {
  id: int("id").primaryKey(),
  rank: int("rank").notNull(),
  name: text("name").notNull(),
  desc: text("desc", { mode: "json" }).$type<string[]>(),
  unlockCost: text("unlock_cost", { mode: "json" }).$type<{
    item_id: number;
    item_num: number;
  }>(),
  param: text("param", { mode: "json" }).$type<string[]>().notNull(),
  /**
   * WARN:
   * @see https://github.com/drizzle-team/drizzle-orm/issues/1503
   */
  // .default([""]),
});

export const eidolonRelations = relations(eidolons, ({ one }) => ({
  avatarToEidolon: one(avatarToEidolons),
}));

export const avatarToEidolons = sqliteTable(
  "honkai_avatarEidolon",
  {
    eidolonId: int("eidolon_id")
      .references(() => eidolons.id, {
        onDelete: "cascade",
      })
      .primaryKey(),
    avatarId: int("avatar_id")
      .references(() => avatars.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (t) => ({
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
    eidolon: one(eidolons, {
      fields: [avatarToEidolons.eidolonId],
      references: [eidolons.id],
    }),
  })
);
