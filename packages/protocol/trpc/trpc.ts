import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError } from "zod";
// import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
// import { getAuth, parseCookie } from "@/lib/utils";
import { transformer } from "./react/transformer";

/**
 * some chunks are copied from t3 app
 * @see https://github.com/t3-oss/create-t3-app
 */

export interface Context {
  // this is where we put in context data e.g bearer token
  // TODO: this + error formatting
  token?: string;
  refreshToken?: string;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = (opts: {
  headers: Headers;
  // cookies?: () => ReadonlyRequestCookies;
}) => {
  // NOTE: THIS UNDEFINED CHECK IS VERY IMPORTANT! ERROR WON'T SHOW UP IN
  // STACK TRACE, CHECK THIS IF YOU SEE ON VERCEL
  // 'undefined' is not valid JSON
  //
  // const { session } = parseCookie(opts.headers.get("cookie") ?? undefined);
  // const token = session?.token ?? getAuth(opts.cookies);

  return {
    // token,
    token: "abc",
    ...opts,
  };
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;

export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(function isAuthed(opts) {
  // BUG: page reload cause this to be {} in server
  if (!opts.ctx.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  // Infers the `session` as non-nullable
  return opts.next({ ctx: opts.ctx });
});
