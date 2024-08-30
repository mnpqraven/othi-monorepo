import { HydrateClient } from "protocol/trpc/react/server";
import { Authed } from "./Authed";

export default function Page() {
  return (
    <HydrateClient>
      <Authed />

      <div className="h-96 rounded-md border">hello</div>
      <div className="h-96 rounded-md border">hello</div>
      <div className="h-96 rounded-md border">hello</div>
      <div className="h-96 rounded-md border">hello</div>
    </HydrateClient>
  );
}
