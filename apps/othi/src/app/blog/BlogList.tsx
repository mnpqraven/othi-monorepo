"use client";

import Link from "next/link";
import { format } from "date-fns";
import { trpc } from "protocol";
import { Button } from "ui/primitive";

/**
 * using client-side for now in case searching and filtering is needed
 */
export function BlogList() {
  const { data, isLoading } = trpc.blog.listMeta.useQuery();
  if (isLoading) return <div className="flex gap-2">Loading...</div>;
  return (
    <>
      {data?.map(({ title, id, createdAt }) => (
        <Link href={`/blog/${id}`} key={id}>
          <Button className="w-full justify-between p-4" variant="outline">
            <span>{title}</span>
            <span className="text-muted-foreground">
              {format(new Date(createdAt), "dd MMM yyyy")}
            </span>
          </Button>
        </Link>
      ))}
    </>
  );
}
