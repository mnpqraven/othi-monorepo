import { SudoGuard } from "@othi/components/SudoGuard";
import Link from "next/link";
import { Badge, Button, Separator } from "ui/primitive";
import { trpcServer } from "protocol/trpc/react/server";
import type { Metadata } from "next";
import { format } from "date-fns";
import { cn } from "lib";
import { isSuperAdmin } from "auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Othi's blogs",
  description: "My personal blogs, random opinions, rants etc.",
};

export default async function Page() {
  const blogs = await trpcServer.blog.listMeta();

  const isSudo = await isSuperAdmin({
    sessionFn: getServerSession,
  });

  // TODO: probably better to have a server side filter
  return (
    <div className="flex flex-col gap-4">
      <SudoGuard>
        <div className="flex items-center justify-end">
          <Link href="/blog/editor">
            <Button>New</Button>
          </Link>
        </div>
      </SudoGuard>

      <div className="flex flex-col gap-4">
        {blogs
          .filter((e) => isSudo || e.publish)
          .map(({ title, id, createdAt, publish }) => (
            <Link href={`/blog/${id}`} key={id}>
              <Button
                className={cn(
                  "w-full flex-col p-4 flex items-start h-fit",
                  "md:flex-row md:justify-between md:items-center",
                )}
                variant="outline"
              >
                <span className="capitalize">{title}</span>
                <div className="flex gap-2 items-center">
                  {!publish ? (
                    <>
                      <Badge>Draft</Badge>
                      <Separator className="h-4" orientation="vertical" />
                    </>
                  ) : null}
                  <span className="text-muted-foreground">
                    {format(createdAt, "dd MMM yyyy")}
                  </span>
                </div>
              </Button>
            </Link>
          ))}
      </div>
    </div>
  );
}
