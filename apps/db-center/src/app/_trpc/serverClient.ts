import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server";

export const server = appRouter.createCaller({
  links: [httpBatchLink({ url: "/api" })],
});
