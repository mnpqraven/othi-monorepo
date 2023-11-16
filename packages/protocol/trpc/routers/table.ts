import { z } from "zod";
import { sql } from "drizzle-orm";
import type { AvatarSchema, ItemSchema, SkillSchema } from "database/schema";
import {
  avatarToSkills,
  avatarEidolons,
  avatarPromotions,
  avatarPromotionItems,
  avatars,
  blogs,
  elements,
  eidolons,
  frameworks,
  itemRarities,
  itemSubTypes,
  itemTypes,
  items,
  lightConeSkills,
  lightCones,
  paths,
  signatures,
  skillTypes,
  skills,
  traces,
  traceItem,
} from "database/schema";
import { db } from "database";
import { publicProcedure, router } from "../trpc";

export type EitherArray<T> = T extends object ? T[] : never;

export type ValidTableNames = keyof typeof db.query;
export type ValidTableSchemas = AvatarSchema | ItemSchema | SkillSchema;

const VALUES: [ValidTableNames, ...ValidTableNames[]] = [
  "avatars",
  // And then merge in the remaining values from `properties`
  ...(Object.keys(db.query).slice(1) as unknown as ValidTableNames[]),
];
const ValidTableNames = z.enum(VALUES);

const PaginationSearch = z.object({
  pageSize: z.number().positive().default(10),
  pageIndex: z.number().nonnegative().default(0),
});

export const TableSearch = z.object({
  tableName: ValidTableNames,
  pagination: PaginationSearch.optional(),
});

export const tableRouter = router({
  list: publicProcedure
    .input(TableSearch)
    .query(async ({ input: { tableName, pagination } }) =>
      getTableData(tableName, pagination),
    ),
});

function tableMap() {
  return {
    avatars,
    avatarToSkills,
    avatarEidolons,
    avatarPromotions,
    avatarPromotionItems,
    blogs,
    elements,
    eidolons,
    frameworks,
    items,
    itemTypes,
    itemSubTypes,
    itemRarities,
    lightCones,
    lightConeSkills,
    paths,
    signatures,
    skills,
    skillTypes,
    traces,
    traceItem,
  };
}

export interface ServerTableResponse {
  data: EitherArray<ValidTableSchemas>;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

async function getTableData(
  tableName: z.TypeOf<typeof ValidTableNames>,
  pagination: Partial<z.TypeOf<typeof PaginationSearch>> = {},
): Promise<ServerTableResponse> {
  const parsing = ValidTableNames.safeParse(tableName);

  if (!parsing.success) return Promise.reject(Error("invalid table name"));

  const { data: name } = parsing;
  const { pageIndex, pageSize } = PaginationSearch.parse(pagination);

  const dbStruct = tableMap()[name];

  const totalQ = await db
    .select({ count: sql<number>`count(*)` })
    .from(dbStruct);
  const totalItems = totalQ.at(0)?.count ?? 0;

  const data = (await db
    .select()
    .from(dbStruct)
    .limit(pageSize)
    .offset(pageIndex * pageSize)) as unknown as EitherArray<ValidTableSchemas>; // safe typecast

  return {
    data,
    pagination: {
      pageIndex,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  };
}
