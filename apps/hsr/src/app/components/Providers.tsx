"use client";

import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { createTransport, TransportProvider } from "protocol/rpc";
import { useState } from "react";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { DevTools } from "jotai-devtools";
import { trpc, trpcUrl } from "protocol";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

interface RootProps {
  children: React.ReactNode;
  headers: Headers;
}

export function AppProvider({ children, headers }: RootProps) {
  const transport = createTransport();
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: trpcUrl(),
          headers() {
            const heads = new Map(headers);
            heads.set("x-trpc-source", "react");
            const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
            heads.set(
              "cache-control",
              `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
            );
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
              <Provider>
                <ReactQueryStreamedHydration transformer={superjson}>
                  {children}
                </ReactQueryStreamedHydration>

                <DevTools isInitialOpen={false} theme="dark" />
                <ReactQueryDevtools initialIsOpen={false} />
              </Provider>
            </QueryClientProvider>
          </TransportProvider>
        </trpc.Provider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
