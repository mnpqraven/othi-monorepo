import { HydrateClient } from "protocol/trpc/react/server";
import { BlogTagTable } from "./BlogTagTable";
import { BlogTagForm } from "./BlogTagForm";

export default function Page() {
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <BlogTagForm />

        <BlogTagTable />
      </div>
    </HydrateClient>
  );
}
