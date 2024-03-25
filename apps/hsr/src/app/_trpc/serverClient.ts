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
