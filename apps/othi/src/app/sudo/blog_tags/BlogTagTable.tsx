"use client";

import { useTable } from "lib";
import { DataTable } from "ui/shared/table";
import { trpc } from "protocol";
import { blogTagColumns } from "./columns";

export function BlogTagTable() {
  const [data] = trpc.othi.blogTag.list.useSuspenseQuery();
  const { table } = useTable({
    data,
    columns: blogTagColumns,
  });

  return <DataTable table={table} />;
}
