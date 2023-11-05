import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "protocol/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
