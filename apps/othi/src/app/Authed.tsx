"use client";

import { trpc } from "protocol";

export function Authed() {
  const { data } = trpc.othi.testSuperAdmin.useQuery();

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
