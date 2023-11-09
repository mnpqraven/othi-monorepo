/* eslint-disable no-console */
import { env } from "@hsr/env";

export async function serverFetch<TPayload, TResponse>(
  endpoint: string,
  opt?: {
    payload?: TPayload;
    method: "POST" | "DELETE";
  }
  // params?: string | number
): Promise<TResponse> {
  const url = env.NEXT_PUBLIC_HOST_NAS_WS + endpoint;

  // POST
  if (opt) {
    const { payload, method } = opt;
    const body = JSON.stringify(payload);
    const res = await fetch(url, {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      method,
    });

    if (res.ok) {
      return res.json() as Promise<TResponse>;
    }
    console.error("api fetch failed, code:", res.status);
    console.error("url:", url);
    const errText = await res.text();
    console.error("unknown error", errText);
    return Promise.reject(Error(`unknown error ${errText}`));
  }
  // GET
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (res.ok) {
    return res.json() as Promise<TResponse>;
  }
  console.error("api fetch failed, code:", res.status);
  console.error("url:", url);
  return Promise.reject(Error(`unknown error ${await res.text()}`));
}
