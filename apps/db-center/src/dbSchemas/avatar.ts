import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { elements } from "./element";
import { paths } from "./path";
import { skills } from "./skill";
import { traces } from "./trace";

export const avatars = sqliteTable("avatar", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  rarity: int("rarity").notNull(),
  votag: text("votag"),
  damageType: text("damage_type")
    .references(() => elements.name)
    .notNull(),
  path: text("path")
    .references(() => paths.name)
    .notNull(),
  spneed: int("spneed"),
});

export const avatarTraces = sqliteTable("avatarTrace", {
  avatarId: int("avatarId").references(() => avatars.id),
  pointId: int("pointId").references(() => traces.id),
});

export const avatarSkills = sqliteTable("avatarSkill", {
  avatarId: int("avatarId").references(() => avatars.id),
  skillId: int("skillId").references(() => skills.id),
});
