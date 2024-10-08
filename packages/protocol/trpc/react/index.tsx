/* eslint-disable camelcase */
/* eslint-disable no-undef-init */
// scaffolding from create t3 app
"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import type { ToastFn } from "ui/primitive/sonner";
import { type AppRouter } from "..";
import { createQueryClient, trpc } from "./client";
import { transformer } from "./transformer";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
let toastFnSingleton: ToastFn | undefined = undefined;

const getQueryClient = (toastFn?: ToastFn) => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  toastFnSingleton ??= toastFn;
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient(toastFnSingleton));
};

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  toastFn?: ToastFn;
}) {
  const queryClient = getQueryClient(props.toastFn);

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer,
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => ({
            "x-trpc-source": "nextjs-react",
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://127.0.0.1:${process.env.PORT ?? 3001}`;
}
