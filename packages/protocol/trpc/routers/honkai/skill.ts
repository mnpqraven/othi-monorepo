import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { SkillSchema, skills } from "database/schema";
import { db } from "database";

export const skillRouter = router({
  list: publicProcedure.query(async ({ input }) => {
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
