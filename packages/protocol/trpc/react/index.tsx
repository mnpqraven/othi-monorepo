import type { ReactNode } from "react";
import { useState } from "react";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import type { QueryClient } from "@tanstack/react-query";
import { trpc } from "../generators/client";
import { trpcUrl } from "../generators/shared";

interface Prop {
  queryClient: QueryClient;
  children: ReactNode;
  headers: Headers;
}
export function TrpcProvider({ queryClient, headers, children }: Prop) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: trpcUrl(),
          headers() {
            const heads = new Map(headers);
            heads.set("x-trpc-source", "react");
            const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
            heads.set(
              "cache-control",
              `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
            );
            return Object.fromEntries(heads);
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
