import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { lightConeSkills } from "./lightConeToSkill";
import { paths } from "./path";
import { signatures } from "./avatarToSignature";

export const lightCones = sqliteTable(
  "honkai_lightCone",
  {
    id: int("id").primaryKey(),
    release: int("release", { mode: "boolean" }),
    name: text("name"),
    rarity: int("rarity"),
    path: text("path").references(() => paths.name, { onDelete: "set null" }),
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
