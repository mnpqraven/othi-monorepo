"use client";

import { Provider } from "jotai";
import { ThemeProvider } from "next-themes";
import { DevTools } from "jotai-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "ui/primitive/tooltip";
import { TRPCReactProvider } from "protocol/trpc/react";
import { transformer } from "protocol/trpc/react/transformer";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

interface RootProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: RootProps) {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}
