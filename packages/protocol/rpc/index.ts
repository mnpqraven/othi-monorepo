import type { ServiceType } from "@bufbuild/protobuf";
import type { PromiseClient } from "@connectrpc/connect";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { env } from "../env";

export function createTransport() {
  return createGrpcWebTransport({
    baseUrl: env.NEXT_PUBLIC_HOST_NAS_WS,
  });
}

export function rpc<T extends ServiceType>(service: T): PromiseClient<T> {
  const client = createPromiseClient(
    service,
    createGrpcWebTransport({
      baseUrl: env.NEXT_PUBLIC_HOST_NAS_WS,
    })
  );
  return client;
}
