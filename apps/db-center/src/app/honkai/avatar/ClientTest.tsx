"use client";

import { trpc } from "@/app/_trpc/client";

export function ClientTest() {
  const { data } = trpc.honkai.test.useQuery();
  return <div>{data}</div>;
}
