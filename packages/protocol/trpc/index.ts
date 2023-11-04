import { router } from "./trpc";
import { honkaiRouter } from "./routers/honkai";
import { tableRouter } from "./routers/table";

export const appRouter = router({
  honkai: honkaiRouter,
  table: tableRouter,
});

export type AppRouter = typeof appRouter;
