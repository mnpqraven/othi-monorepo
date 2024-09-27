import { SudoGuard } from "@othi/components/SudoGuard";
import Link from "next/link";
import { Button } from "ui/primitive";
import { trpcServer } from "protocol/trpc/react/server";
import { DemoUploadButton } from "./DemoUploadButton";

export default async function Page() {
  const list = await trpcServer.utils.blog.metaList();

  return (
    <div>
      <span>blog list</span>

      <SudoGuard>
        <Link href="/blog/create">
          <Button>create</Button>
        </Link>
        <DemoUploadButton />
      </SudoGuard>

      {JSON.stringify(list)}
    </div>
  );
}
