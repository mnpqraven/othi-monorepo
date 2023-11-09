import { router } from "./trpc";
import { tableRouter } from "./routers/table";
import { honkaiRouter } from "./routers/honkai";

export const appRouter = router({
  honkai: honkaiRouter,
  table: tableRouter,
});

export type AppRouter = typeof appRouter;
