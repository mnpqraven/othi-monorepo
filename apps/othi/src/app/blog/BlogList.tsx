"use client";

import Link from "next/link";
import { format } from "date-fns";
import { trpc } from "protocol";
import { Button } from "ui/primitive";
import { cn } from "lib";

/**
 * using client-side for now in case searching and filtering is needed
 */
export function BlogList() {
  const [data] = trpc.blog.listMeta.useSuspenseQuery(undefined, {
    // client caches for an hour
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-4">
      {data.map(({ title, id, createdAt }) => (
        <Link href={`/blog/${id}`} key={id}>
          <Button
            className={cn(
              "w-full flex-col p-4 flex items-start h-fit",
              "md:flex-row md:justify-between md:items-center",
            )}
            variant="outline"
          >
            <span className="capitalize">{title}</span>
            <span className="text-muted-foreground">
              {format(createdAt, "dd MMM yyyy")}
            </span>
          </Button>
        </Link>
      ))}
    </div>
  );
}
