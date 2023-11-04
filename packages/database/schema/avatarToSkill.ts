import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { avatars, skillTypes } from ".";
import { InferSelectModel, relations } from "drizzle-orm";

export const avatarToSkills = sqliteTable(
  "honkai_avatarSkill",
  {
    avatarId: int("avatar_id")
      .references(() => avatars.id, { onDelete: "cascade" })
      .notNull(),
    skillId: int("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    avatarIdx: index("idx_avatarSkill_avatar_id").on(t.avatarId),
    skillIdx: uniqueIndex("idx_avatarSkill_skill_id").on(t.skillId),
  })
);

export const avatarToSkillRelations = relations(avatarToSkills, ({ one }) => ({
  avatar: one(avatars, {
    fields: [avatarToSkills.avatarId],
    references: [avatars.id],
  }),
  skill: one(skills, {
    fields: [avatarToSkills.skillId],
    references: [skills.id],
  }),
}));

export const skills = sqliteTable("honkai_skill", {
  id: int("id").primaryKey(),
  name: text("name"),
  tag: text("tag"),
  typeDesc: text("type_desc"),
  maxLevel: int("max_level"),
  spGain: int("spbase"),
  spNeed: int("spneed"),
  attackType: text("attack_type").references(() => skillTypes.name, {
    onDelete: "set null",
  }),
  skillDesc: text("skill_desc", { mode: "json" }).$type<string[]>(),
  paramList: text("param_list", { mode: "json" }).$type<string[][]>(),
});

export type SkillSchema = InferSelectModel<typeof skills>;

export const skillRelations = relations(skills, ({ many }) => ({
  avatarToSkills: many(avatarToSkills),
}));
