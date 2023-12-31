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
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@db-center/app/_trpc/client";
import superjson from "superjson";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [httpBatchLink({ url: "/api" })],
    })
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
