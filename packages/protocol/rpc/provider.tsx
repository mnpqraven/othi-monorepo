import type { ReactNode } from "react";
import { TransportProvider } from "@connectrpc/connect-query";
import { createTransport } from ".";

export function RpcProvider({ children }: { children: ReactNode }) {
  const transport = createTransport();
  return (
    <TransportProvider transport={transport}>{children}</TransportProvider>
  );
}
