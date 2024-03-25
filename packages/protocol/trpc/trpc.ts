import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import superjson from "superjson";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    // eslint-disable-next-line no-console
    console.log(error);
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
