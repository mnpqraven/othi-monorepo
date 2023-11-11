import { httpBatchLink } from "@trpc/client";
import { appRouter } from "protocol/trpc";

export const server = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: "/api",
      headers() {
        // cache request for 1 day + revalidate once every 30 seconds
        const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
        return {
          "cache-control": `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        };
      },
    }),
  ],
});
