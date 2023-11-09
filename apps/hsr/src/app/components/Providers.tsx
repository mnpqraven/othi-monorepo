"use client";

import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useHydrateAtoms } from "jotai/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { Provider } from "jotai";
import { TransportProvider } from "@connectrpc/connect-query";
import { createTransport } from "protocol/rpc";

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

  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <TransportProvider transport={transport}>
          <QueryClientProvider client={queryClient}>
            <Provider>
              <HydrateAtoms>{children}</HydrateAtoms>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </TransportProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
