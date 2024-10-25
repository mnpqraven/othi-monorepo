import { SudoGuard } from "@othi/components/SudoGuard";
import Link from "next/link";
import { Button } from "ui/primitive";
import { HydrateClient, trpcServer } from "protocol/trpc/react/server";
import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogList } from "./BlogList";

export const metadata: Metadata = {
  title: "Othi's blogs",
  description: "My personal blogs, random opinions, rants etc.",
};

export default async function Page() {
  void trpcServer.blog.listMeta.prefetch();

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <SudoGuard>
          <div className="flex items-center justify-end">
            <Link href="/blog/editor">
              <Button>New</Button>
            </Link>
          </div>
        </SudoGuard>

        <Suspense
          fallback={
            <Button className="w-full justify-between p-4" variant="outline">
              Loading...
            </Button>
          }
        >
          <BlogList />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
