import type { InferSelectModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { avatars } from ".";

export type EidolonSchema = InferSelectModel<typeof eidolons>;
export const eidolons = sqliteTable("honkai_eidolon", {
  id: int("id").primaryKey(),
  rank: int("rank").notNull(),
  name: text("name").notNull(),
  desc: text("desc", { mode: "json" })
    .$type<string[]>()
    .default(sql`"[]"`),
  unlockCost: text("unlock_cost", { mode: "json" }).$type<{
    item_id: number;
    item_num: number;
  }>(),
  param: text("param", { mode: "json" })
    .$type<string[]>()
    .notNull()
    /**
     * WARN:
     * @see https://github.com/drizzle-team/drizzle-orm/issues/1503
     */
    .default(sql`"[]"`),
});

export const eidolonRelations = relations(eidolons, ({ one }) => ({
  avatarEidolon: one(avatarEidolons),
}));

export const avatarEidolons = sqliteTable(
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
  }),
);

export const avatarEidolonRelations = relations(avatarEidolons, ({ one }) => ({
  avatar: one(avatars, {
    fields: [avatarEidolons.avatarId],
    references: [avatars.id],
  }),
  eidolon: one(eidolons, {
    fields: [avatarEidolons.eidolonId],
    references: [eidolons.id],
  }),
}));
