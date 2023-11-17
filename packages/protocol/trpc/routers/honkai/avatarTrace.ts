import { db } from "database";
import { CharId } from "../../inputSchemas";
import { publicProcedure, router } from "../../trpc";

export const avatarTraceRouter = router({
  by: publicProcedure.input(CharId).query(async ({ input }) => {
    const query = db.query.traces.findMany({
      where: (map, { eq }) => eq(map.avatarId, input.charId),
    });
    return await query;
  }),
});
