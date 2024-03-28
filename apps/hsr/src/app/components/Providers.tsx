"use client";

import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { createTransport, TransportProvider } from "protocol/rpc";
import { useState } from "react";
import superjson from "superjson";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { DevTools } from "jotai-devtools";
import { TrpcProvider } from "protocol/trpc/react";

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

  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <TrpcProvider headers={headers} queryClient={queryClient}>
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
        </TrpcProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
