import { ServiceType } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { env } from "../env";

export function rpc<T extends ServiceType>(service: T) {
  const client = createPromiseClient(
    service,
    createGrpcWebTransport({
      baseUrl: env.NEXT_PUBLIC_WORKER_API,
    })
  );
  return client;
}
