import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { lightCones } from "./lightCone";

export const lightConeToSkills = sqliteTable("honkai_lightConeSkill", {
  id: int("id").primaryKey(),
  name: text("name"),
  desc: text("desc", { mode: "json" }).$type<string[]>(),
  paramList: text("param_list", { mode: "json" }).$type<string[][]>(), // string[][]
  abilityProperty: text("ability_property", { mode: "json" }).$type<
    // TODO: Property type
    { propertyType: string; value: { value: number } }[][]
  >(),
});

export type LightConeSkillSchema = InferSelectModel<typeof lightConeToSkills>;

export const lightConeToSkillRelations = relations(
  lightConeToSkills,
  ({ one }) => ({
    lightCone: one(lightCones, {
      fields: [lightConeToSkills.id],
      references: [lightCones.skillId],
    }),
  })
);
