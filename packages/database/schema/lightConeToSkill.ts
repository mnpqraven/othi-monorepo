import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { lightCones } from "./lightCone";

export const lightConeSkills = sqliteTable("honkai_lightConeSkill", {
  id: int("id").primaryKey(),
  name: text("name"),
  desc: text("desc", { mode: "json" }).$type<string[]>(),
  paramList: text("param_list", { mode: "json" }).$type<string[][]>(), // string[][]
  abilityProperty: text("ability_property", { mode: "json" }).$type<
    // TODO: Property type
    { propertyType: string; value: { value: number } }[][]
  >(),
});

export type LightConeSkillSchema = InferSelectModel<typeof lightConeSkills>;

export const lightConeSkillRelations = relations(
  lightConeSkills,
  ({ one }) => ({
    lightCone: one(lightCones, {
      fields: [lightConeSkills.id],
      references: [lightCones.skillId],
    }),
  })
);
