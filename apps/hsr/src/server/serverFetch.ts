/* eslint-disable no-console */
import { env } from "@hsr/env";
import { extractError } from "./handle";

export async function serverFetch<TPayload, TResponse>(
  endpoint: string,
  opt?: {
    payload?: TPayload;
    method: "POST" | "DELETE";
  }
  // params?: string | number
): Promise<TResponse> {
  const url = env.NEXT_PUBLIC_HOST_NAS_WS + endpoint;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = opt?.payload ? JSON.stringify(opt.payload) : undefined;

  // POST
  const res = await fetch(url, {
    body,
    headers,
    method: opt?.method ?? "GET",
  });

  if (res.ok) {
    return res.json() as Promise<TResponse>;
  }

  const errText = await res.text();
  const errString = extractError(JSON.parse(errText));

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV !== "production") {
    console.error(`api fetch failed, code: ${res.status}, url: ${url}`);
    console.error("unknown error", errString);
  }

  return Promise.reject(Error(errString));
}
