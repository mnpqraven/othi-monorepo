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
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { trpc } from "../_trpc/client";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

interface RootProps {
  children: React.ReactNode;
}
const queryClient = new QueryClient(TANSTACK_CONFIG);

const HydrateAtoms = ({ children }: RootProps) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export default function RQProvider({ children }: RootProps) {
  const transport = createTransport();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: "/api",
          headers() {
            // cache request for 1 day + revalidate once every 30 seconds
            const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
            return {
              "cache-control": `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
            };
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
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </TransportProvider>
        </trpc.Provider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
