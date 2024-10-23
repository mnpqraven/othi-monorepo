import "server-only";

import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache as reactCache } from "react";
import { type AppRouter, createCaller } from "..";
import { createTRPCContext } from "../trpc";
import { createQueryClient } from "./client";
import { transformer } from "./transformer";
import { unstable_cache as internal_unstable_cache } from "next/cache";

const createContext = reactCache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 *
 * This function allows you to cache the results of expensive operations, like database queries, and reuse them across multiple requests.
 */
export const unstable_cache = <T, P extends unknown[]>(
  fn: (...params: P) => Promise<T>,
  keys: Parameters<typeof internal_unstable_cache>[1],
  opts: Parameters<typeof internal_unstable_cache>[2],
) => {
  const wrap = async (params: unknown[]): Promise<string> => {
    const result = await fn(...(params as P));
    return transformer.stringify(result);
  };

  const cachedFn = internal_unstable_cache(wrap, keys, opts);

  return async (...params: P): Promise<T> => {
    const result = await cachedFn(params);
    return transformer.parse(result);
  };
};

const getQueryClient = reactCache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: trpcServer, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
