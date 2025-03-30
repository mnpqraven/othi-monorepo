"use client";

import { useTable } from "lib";
import { DataTable } from "ui/shared/table/DataTable";
import { trpc } from "protocol";
import { useMemo } from "react";
import { blogTagColumns } from "./columns";

export function BlogTagTable() {
  const { data } = trpc.othi.blogTag.list.useQuery();
  const tableData = useMemo(() => data ?? [], [data]);
  const { table } = useTable({
    data: tableData,
    columns: blogTagColumns,
  });

  return <DataTable table={table} />;
}
