"use client";

import { DevTools } from "jotai-devtools";
import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { TooltipProvider } from "ui/primitive/tooltip";
import { Provider } from "jotai";
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
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <TrpcProvider headers={headers} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Provider>
              {children}

              <DevTools isInitialOpen={false} theme="dark" />
              <ReactQueryDevtools initialIsOpen={false} />
            </Provider>
          </QueryClientProvider>
        </TrpcProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
