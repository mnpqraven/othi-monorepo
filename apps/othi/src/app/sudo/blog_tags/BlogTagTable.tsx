"use client";

import { inferProcedureOutput } from "@trpc/server";
import { useTable } from "lib";
import { AppRouter } from "protocol/trpc";
import { blogTagColumns } from "./columns";
import { DataTable } from "ui/shared/table";

interface Prop {
  data: inferProcedureOutput<
    AppRouter["_def"]["procedures"]["othi"]["blogTag"]["list"]
  >;
}
export function BlogTagTable({ data }: Prop) {
  const { table } = useTable({
    data,
    columns: blogTagColumns,
  });

  return <DataTable table={table} />;
}
