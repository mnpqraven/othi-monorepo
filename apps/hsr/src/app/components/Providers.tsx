"use client";

import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useHydrateAtoms } from "jotai/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { Provider } from "jotai";
import { createTransport, TransportProvider } from "protocol/rpc";
import { useState } from "react";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { DevTools } from "jotai-devtools";
import type { AppRouter } from "protocol/trpc";
import { createTRPCReact } from "@trpc/react-query";
import { trpc } from "../_trpc/client";
import { getUrl } from "../_trpc/shared";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

interface RootProps {
  children: React.ReactNode;
  headers: Headers;
}

export const api = createTRPCReact<AppRouter>();

const queryClient = new QueryClient(TANSTACK_CONFIG);

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export function AppProvider({ children, headers }: RootProps) {
  const transport = createTransport();
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          transformer: superjson,
          headers() {
            const heads = new Map(headers);
            heads.set("x-trpc-source", "react");
            return Object.fromEntries(heads);
          },
        }),
      ],
    })
  );

  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <TransportProvider transport={transport}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryStreamedHydration transformer={superjson}>
                <Provider>
                  <HydrateAtoms>{children}</HydrateAtoms>
                </Provider>
              </ReactQueryStreamedHydration>

              <DevTools isInitialOpen={false} theme="dark" />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </TransportProvider>
        </trpc.Provider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
