import { httpBatchLink } from "@trpc/client";
import { appRouter } from "protocol/trpc";

export const server = appRouter.createCaller({
  links: [httpBatchLink({ url: "/api" })],
});
