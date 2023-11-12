import { db } from "database";
import type { AvatarSchema } from "database/schema";
import { avatars } from "database/schema";
import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { CharId } from "../../inputSchemas";

export const avatarRouter = router({
  list: publicProcedure.query(
    async () =>
      (await db.select().from(avatars).all()) satisfies Awaited<AvatarSchema[]>
  ),
  eidolons: publicProcedure.input(CharId).query(async ({ input }) => {
    const query = db.query.avatarToEidolons.findMany({
      where: (map, { eq }) => eq(map.avatarId, input.charId),
      with: {
        eidolon: true,
      },
    });
    const data = (await query)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((e) => e.eidolon!)
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
});
