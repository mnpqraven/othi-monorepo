"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "ui/primitive/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import { createTransport, TransportProvider } from "protocol/rpc";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { DevTools } from "jotai-devtools";
import { TRPCReactProvider } from "protocol/trpc/react";
import { transformer } from "protocol/trpc/react/transformer";
import { SessionProvider } from "next-auth/react";
import { toast } from "ui/primitive/sonner";

interface RootProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: RootProps) {
  const transport = createTransport();

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider delayDuration={300}>
          <TRPCReactProvider toastFn={toast}>
            <TransportProvider transport={transport}>
              <Provider>
                <ReactQueryStreamedHydration transformer={transformer}>
                  {children}
                </ReactQueryStreamedHydration>

                <DevTools isInitialOpen={false} theme="dark" />
                <ReactQueryDevtools initialIsOpen={false} />
              </Provider>
            </TransportProvider>
          </TRPCReactProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
