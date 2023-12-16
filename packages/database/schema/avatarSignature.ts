import { index, int, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { avatars } from "./avatar";
import { lightCones } from "./lightCone";

export const signatures = sqliteTable(
  "honkai_signature",
  {
    avatarId: int("avatar_id").references(() => avatars.id, {
      onDelete: "cascade",
    }),
    lightConeId: int("lightcone_id").references(() => lightCones.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({
    pk: primaryKey(t.avatarId, t.lightConeId),
    signatureIdx: index("idx_signature_avatar_id").on(t.avatarId),
    lightConeIdx: index("idx_signature_lightcone_id").on(t.lightConeId),
  })
);

export const signaturesRelations = relations(signatures, ({ one }) => ({
  avatar: one(avatars, {
    fields: [signatures.avatarId],
    references: [avatars.id],
  }),
  lightCone: one(lightCones, {
    fields: [signatures.lightConeId],
    references: [lightCones.id],
  }),
}));
