import { publicProcedure, router } from "./trpc";
import { honkaiRouter } from "./routers/honkai";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [10, 20];
  }),
  honkai: honkaiRouter,
});

export type AppRouter = typeof appRouter;
