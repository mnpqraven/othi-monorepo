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
  signatures: router({
    by: publicProcedure
      .input(CharId.extend({ skill: z.boolean().default(true) }))
      .query(async ({ input }) =>
        db.query.avatars
          .findFirst({
            where: (avatar, { eq }) => eq(avatar.id, input.charId),
            columns: {},
            with: {
              signature: {
                columns: {},
                with: {
                  lightCone: {
                    with: {
                      skill: input.skill || undefined,
                    },
                  },
                },
              },
            },
          })
          .then((data) => data?.signature.flatMap((e) => e.lightCone) ?? [])
      ),
  }),
});
