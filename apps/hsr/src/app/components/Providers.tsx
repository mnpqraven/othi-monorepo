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
import type { AppRouter } from "protocol/trpc";
import { createTRPCReact } from "@trpc/react-query";
import { trpc } from "../_trpc/client";
import { getUrl, transformer } from "../_trpc/shared";

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

export function AppProvider({ children, headers }: RootProps) {
  const transport = createTransport();
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer,
          url: getUrl(),
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
