import type { ColumnDef } from "@tanstack/react-table";
import type { AvatarSchema, ItemSchema, SkillSchema } from "database/schema";
import type {
  ValidTableSchemas,
  ValidTableNames,
} from "protocol/trpc/routers/table";
import { avatarColumns } from "../_columns/avatar";
import { itemColumns } from "../_columns/item";
import { skillColumns } from "../_columns/skill";

export type EitherArrayKeyof<T> = T extends object ? (keyof T)[] : never;
export type EitherArrayColumns<T> = T extends object
  ? ColumnDef<T, never>[]
  : never;

interface PageDataSet {
  columns: EitherArrayColumns<ValidTableSchemas>;
  searchKeys: EitherArrayKeyof<ValidTableSchemas>;
}

export const TABLE_DICT: Partial<Record<ValidTableNames, PageDataSet>> = {
  avatars: {
    columns: avatarColumns,
    searchKeys: ["id", "name", "votag"] satisfies (keyof AvatarSchema)[],
  },
  items: {
    columns: itemColumns,
    searchKeys: ["id", "itemName"] satisfies (keyof ItemSchema)[],
  },
  skills: {
    columns: skillColumns,
    searchKeys: ["id", "name", "attackType"] satisfies (keyof SkillSchema)[],
  },
};
