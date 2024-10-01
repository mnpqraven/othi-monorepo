"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { RpcProvider } from "protocol/rpc";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { DevTools } from "jotai-devtools";
import { TRPCReactProvider } from "protocol/trpc/react";
import { transformer } from "protocol/trpc/react/transformer";

interface RootProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: RootProps) {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <TRPCReactProvider>
          <RpcProvider>
            <Provider>
              <ReactQueryStreamedHydration transformer={transformer}>
                {children}
              </ReactQueryStreamedHydration>

              <DevTools isInitialOpen={false} theme="dark" />
              <ReactQueryDevtools initialIsOpen={false} />
            </Provider>
          </RpcProvider>
        </TRPCReactProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
