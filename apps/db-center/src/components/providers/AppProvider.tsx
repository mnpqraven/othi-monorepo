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
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider delayDuration={300}>
          <TrpcProvider headers={headers} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Provider>
                {children}

                <DevTools isInitialOpen={false} />
                <ReactQueryDevtools initialIsOpen={false} />
              </Provider>
            </QueryClientProvider>
          </TrpcProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
