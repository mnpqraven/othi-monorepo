"use client";

import { DevTools } from "jotai-devtools";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "ui/primitive/tooltip";
import { Provider } from "jotai";
import { TRPCReactProvider } from "protocol/trpc/react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { transformer } from "protocol/trpc/react/transformer";

interface RootProps {
  children: React.ReactNode;
}
export function AppProvider({ children }: RootProps) {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <TRPCReactProvider>
          <Provider>
            <ReactQueryStreamedHydration transformer={transformer}>
              {children}
            </ReactQueryStreamedHydration>

            <DevTools isInitialOpen={false} theme="dark" />
            <ReactQueryDevtools initialIsOpen={false} />
          </Provider>
        </TRPCReactProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
