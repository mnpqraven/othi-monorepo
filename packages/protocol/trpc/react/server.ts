import "server-only";

import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { type AppRouter, createCaller } from "..";
import { createTRPCContext } from "../trpc";
import { createQueryClient } from "./client";

const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: trpcServer, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
