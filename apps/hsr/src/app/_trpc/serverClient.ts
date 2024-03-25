import "server-only";

import { t } from "protocol/trpc/trpc";
import { appRouter } from "protocol/trpc";

/**
 * Export caller factory to be used in server-side context like route handlers
 * NOTE: this needs to be a callback, normal const reassigning results in
 * out-of-scope cookies function call
 */
const caller = t.createCallerFactory(appRouter);
export const server = () => caller({});

// import { httpBatchLink } from "@trpc/client";
// import { appRouter } from "protocol/trpc";
//
// export const server = appRouter.createCaller({
//   links: [
//     httpBatchLink({
//       url: "/api",
//       headers() {
//         // cache request for 1 day + revalidate once every 30 seconds
//         const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
//         return {
//           "cache-control": `s-maxage=30, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
//         };
//       },
//     }),
//   ],
// });
