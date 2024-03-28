import { z } from "zod";
import { db } from "database";
import { CharId } from "../../inputSchemas";
import { publicProcedure, router } from "../../trpc";

export const avatarPromotionRouter = router({
  by: publicProcedure
    .input(
      CharId.extend({
        withItems: z.custom<true | undefined>().optional(),
        maxAscension: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const query = db.query.avatarPromotions.findMany({
        with: {
          promotion: {
            with: {
              promotionItem: {
                with: { item: input.withItems },
              },
            },
          },
        },
        where: (map, { eq, lte }) =>
          input.maxAscension
            ? eq(map.characterId, input.charId).append(
                lte(map.ascension, input.maxAscension),
              )
            : eq(map.characterId, input.charId),
        orderBy: (data, { asc }) => [asc(data.ascension)],
      });

      const data = await query;
      return data;
    }),
});
