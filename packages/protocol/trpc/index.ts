import "server-only";

import { createCallerFactory, router } from "./trpc";
import { tableRouter } from "./routers/table";
import { honkaiRouter } from "./routers/honkai";
import { othiRouter } from "./routers/othi";
import { blogRouter } from "./routers/utils/blog";
import type { RouterInputs, RouterOutputs } from "./react/client";

export const appRouter = router({
  honkai: honkaiRouter,
  table: tableRouter,
  utils: {
    blog: blogRouter,
  },
  othi: othiRouter,
});

// NOTE: Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

export type { RouterInputs, RouterOutputs };
