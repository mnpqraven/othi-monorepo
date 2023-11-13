import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { ELEMENTS, elements } from "./element";
import { avatarToSkills } from "./avatarToSkill";
import { PATHS, paths } from "./path";
import { traces } from "./trace";
import { signatures } from "./avatarToSignature";

export const avatars = sqliteTable("honkai_avatar", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  rarity: int("rarity").notNull(),
  votag: text("votag"),
  element: text("element", { enum: ELEMENTS })
    .references(() => elements.name, { onUpdate: "cascade" })
    .notNull(),
  path: text("path", { enum: PATHS })
    .references(() => paths.name, { onUpdate: "cascade" })
    .notNull(),
  spneed: int("spneed"),
});

export type AvatarSchema = InferSelectModel<typeof avatars>;

export const avatarRelations = relations(avatars, ({ many }) => ({
  avatarToSkills: many(avatarToSkills),
  signature: many(signatures),
}));

export const avatarTraces = sqliteTable(
  "honkai_avatarTrace",
  {
    avatarId: int("avatar_id").references(() => avatars.id, {
      onDelete: "cascade",
    }),
    pointId: int("point_id").references(() => traces.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({ pk: primaryKey(t.avatarId, t.pointId) })
);

export const traceRelations = relations(avatarTraces, ({ one }) => ({
  avatar: one(avatars, {
    fields: [avatarTraces.avatarId],
    references: [avatars.id],
  }),
  trace: one(traces, {
    fields: [avatarTraces.pointId],
    references: [traces.id],
  }),
}));
