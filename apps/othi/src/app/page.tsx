import { HydrateClient } from "protocol/trpc/react/server";
import { Authed } from "./Authed";

export default function Page() {
  return (
    <HydrateClient>
      <Authed />
    </HydrateClient>
  );
}
