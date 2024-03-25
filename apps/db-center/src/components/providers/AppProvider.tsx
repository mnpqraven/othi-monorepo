"use client";

import { Provider } from "jotai";
import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { DevTools } from "jotai-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { TooltipProvider } from "ui/primitive/tooltip";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
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
              `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
            );
            return Object.fromEntries(heads);
          },
        }),
      ],
    }),
  );

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider delayDuration={300}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Provider>
                {children}

                <DevTools isInitialOpen={false} />
                <ReactQueryDevtools initialIsOpen={false} />
              </Provider>
            </QueryClientProvider>
          </trpc.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
