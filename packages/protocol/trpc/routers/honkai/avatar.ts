import { db } from "database";
import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { CharId } from "../../inputSchemas";
import { avatarPromotionRouter } from "./avatarPromotion";

// TODO: promotion
// TODO: trace
export const avatarRouter = router({
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
    )
    .query(async ({ input }) => {
      const query = db.query.avatars.findMany();
      const data = (await query).sort((a, b) => {
        const raritySort =
          Number(Boolean(input?.sort.rarity)) && b.rarity - a.rarity;
        const nameSort =
          Number(Boolean(input?.sort.name)) &&
          (a.name.localeCompare(b.name) ||
            (a.votag ?? "").localeCompare(b.votag ?? ""));
        return raritySort || nameSort;
      });
      return data;
    }),

  by: publicProcedure
    .input(
      CharId.extend({
        withSkill: z.custom<true | undefined>().optional(),
        withSignature: z.custom<true | undefined>().optional(),
      })
    )
    .query(({ input }) => {
      const { charId, withSignature, withSkill } = input;
      const query = db.query.avatars.findFirst({
        where: (map, { eq }) => eq(map.id, charId),
        with: {
          avatarToSkills: withSkill ? { with: { skill: true } } : undefined,
          signature: withSignature ? { with: { lightCone: true } } : undefined,
        },
      });

      return query;
    }),

  eidolons: publicProcedure.input(CharId).query(async ({ input }) => {
    const query = db.query.avatarEidolons.findMany({
      where: (map, { eq }) => eq(map.avatarId, input.charId),
      with: {
        eidolon: true,
      },
    });
    const data = (await query)
      .map((e) => e.eidolon)
      .sort((a, b) => a.rank - b.rank);
    return data;
  }),

  signatures: publicProcedure
    .input(CharId.extend({ skill: z.boolean().default(true) }))
    .query(async ({ input }) => {
      const query = db.query.signatures.findMany({
        where: (signature, { eq }) => eq(signature.avatarId, input.charId),
        with: {
          lightCone: {
            with: {
              skill: input.skill || undefined,
            },
          },
        },
      });

      const data = (await query)
        .filter((e) => Boolean(e.lightCone))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((e) => e.lightCone!);

      return data;
    }),

  promotions: avatarPromotionRouter,
});
