import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { appRouter } from "protocol/trpc";
import { createTRPCContext } from "protocol/trpc/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        cookies,
      }),
  });

export { handler as GET, handler as POST };
