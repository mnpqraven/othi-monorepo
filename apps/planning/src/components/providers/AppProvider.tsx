"use client";

import { DevTools } from "jotai-devtools";
import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { TooltipProvider } from "ui/primitive/tooltip";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@planning/app/_trpc/client";
import superjson from "superjson";
import { Provider } from "jotai";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "/api", transformer: superjson })],
    }),
  );

  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Provider>
              {children}

              <DevTools isInitialOpen={false} theme="dark" />
              <ReactQueryDevtools initialIsOpen={false} />
            </Provider>
          </QueryClientProvider>
        </trpc.Provider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
