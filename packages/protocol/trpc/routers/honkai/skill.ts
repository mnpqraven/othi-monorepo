import { z } from "zod";
import type { SkillSchema } from "database/schema";
import { skills } from "database/schema";
import { db } from "database";
import { publicProcedure, router } from "../../trpc";

export const skillRouter = router({
  list: publicProcedure.query(async () => {
    return (await db.select().from(skills)) satisfies Awaited<SkillSchema[]>;
  }),
  by: publicProcedure
    .input(z.object({ charId: z.number(), clean: z.boolean().default(true) }))
    .query(async ({ input }) => {
      const query = db.query.avatarToSkills
        .findMany({
          where: (map, { eq }) => eq(map.avatarId, input.charId),
          columns: {},
          with: { skill: true },
        })
        .then((res) => res.map((e) => e.skill));

      if (input.clean) {
        return query.then((res) =>
          res.filter((skill) => skill.attackType !== "MazeNormal")
        );
      }

      return query;
    }),
});
