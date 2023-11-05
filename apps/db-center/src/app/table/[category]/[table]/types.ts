import type { AvatarSchema, ItemSchema, SkillSchema } from "database/schema";

export type Categories = "honkai";
export type Tables = "avatar" | "item" | "skill";

export type TableStructs = AvatarSchema | ItemSchema | SkillSchema;
