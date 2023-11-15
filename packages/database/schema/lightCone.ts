import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { lightConeSkills } from "./lightConeSkill";
import { PATHS, paths } from "./path";
import { signatures } from "./avatarSignature";

export const lightCones = sqliteTable(
  "honkai_lightCone",
  {
    id: int("id").primaryKey(),
    release: int("release", { mode: "boolean" }),
    name: text("name").notNull(),
    rarity: int("rarity").notNull(),
    path: text("path", { enum: PATHS })
      .references(() => paths.name, { onDelete: "cascade" })
      .notNull(),
    maxPromotion: int("max_promotion"),
    maxRank: int("max_rank"),
    skillId: int("skill_id").references(() => lightConeSkills.id, {
      onDelete: "set null",
    }),
    // exp_type: u32,
    // exp_provide: u32,
    // coin_cost: u32,
    // rank_up_cost_list: Vec<u32>,
  },
  (t) => ({
    lightConeSkillIdx: index("idx_lightcone_skill_id").on(t.skillId),
  })
);

export type LightConeSchema = InferSelectModel<typeof lightCones>;

export const lightConeRelations = relations(lightCones, ({ one }) => ({
  skill: one(lightConeSkills, {
    fields: [lightCones.skillId],
    references: [lightConeSkills.id],
  }),
  signature: one(signatures, {
    fields: [lightCones.id],
    references: [signatures.lightConeId],
  }),
}));
