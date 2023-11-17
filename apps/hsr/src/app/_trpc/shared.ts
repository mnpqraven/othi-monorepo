import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "protocol/trpc";
import superjson from "superjson";

export const transformer = superjson;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return `http://localhost:${process.env.PORT ?? 4000}`;
}

export function getUrl() {
  return `${getBaseUrl()}/api`;
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
