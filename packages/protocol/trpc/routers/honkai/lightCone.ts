import { z } from "zod";
import { db } from "database";
import { publicProcedure, router } from "../../trpc";
import { LcId } from "../../inputSchemas";

export const lightConeRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          all: z.boolean().default(true),
          sort: z
            .object({
              rarity: z.boolean().default(true),
              name: z.boolean().default(true),
            })
            .default({ name: true, rarity: true }),
        })
        .optional()
        .default({ sort: { name: true, rarity: true }, all: true }),
    )
    .query(async ({ input }) => {
      const query = db.query.lightCones.findMany();
      const data = (await query).sort((a, b) => {
        const raritySort =
          Number(Boolean(input?.sort.rarity)) && b.rarity - a.rarity;
        const nameSort =
          Number(Boolean(input?.sort.name)) && a.name.localeCompare(b.name);
        return raritySort || nameSort;
      });
      return data;
    }),

  by: publicProcedure
    .input(
      LcId.extend({
        withSkill: z.custom<true | undefined>().optional(),
        withSignature: z.custom<true | undefined>().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { lcId, withSignature, withSkill } = input;
      const query = db.query.lightCones.findFirst({
        where: (map, { eq }) => eq(map.id, lcId),
        with: {
          skill: withSkill,
          signature: withSignature ? { with: { lightCone: true } } : undefined,
        },
      });
      return query;
    }),
});
