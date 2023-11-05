import { z } from "zod";
import type { SkillSchema } from "database/schema";
import { skills } from "database/schema";
import { db } from "database";
import { publicProcedure, router } from "../../trpc";

export const skillRouter = router({
  list: publicProcedure.query(async () => {
    return (await db.select().from(skills)) satisfies Awaited<SkillSchema[]>;
  }),
  byCharId: publicProcedure
    .input(
      z.object({
        charId: z.number(),
        // withDescription: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const t = await db.query.avatarToSkills.findMany({
        where: (map, { eq }) => eq(map.avatarId, input.charId),
        columns: {},
        with: { skill: true },
      });
      const data: SkillSchema[] = t.map((e) => e.skill);
      return data;
    }),
});
