/* eslint-disable camelcase */
import "server-only";

import { cookies, headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache as reactCache } from "react";
import { unstable_cache } from "next/cache";
import { type AppRouter, createCaller } from "..";
import { createTRPCContext } from "../trpc";
import { createQueryClient } from "./client";
import { transformer } from "./transformer";

const createContext = reactCache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    cookies,
  });
});

/**
 * This function allows you to cache the results of expensive operations, like database queries, and reuse them across multiple requests.
 */
export const cache = <T, P extends unknown[]>(
  fn: (...params: P) => Promise<T>,
  keys: Parameters<typeof unstable_cache>[1],
  opts?: Parameters<typeof unstable_cache>[2],
) => {
  const wrap = async (params: unknown[]): Promise<string> => {
    const result = await fn(...(params as P));
    return transformer.stringify(result);
  };

  const cachedFn = unstable_cache(wrap, keys, opts);

  return async (...params: P): Promise<T> => {
    const result = await cachedFn(params);
    return transformer.parse(result);
  };
};

const getQueryClient = reactCache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: trpcServer, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
