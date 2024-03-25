import "server-only";

import { router, t } from "./trpc";
import { tableRouter } from "./routers/table";
import { honkaiRouter } from "./routers/honkai";

export const appRouter = router({
  honkai: honkaiRouter,
  table: tableRouter,
});

/**
 * Export caller factory to be used in server-side context like route handlers
 * NOTE: this needs to be a callback, normal const reassigning results in
 * out-of-scope cookies function call
 */
const caller = t.createCallerFactory(appRouter);
export const server = () => caller({});

export type AppRouter = typeof appRouter;
