"use client";
import { Provider } from "jotai";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { DevTools } from "jotai-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from "@trpc/client";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  const [trpcClient] = useState(() =>
    trpc.createClient({
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
