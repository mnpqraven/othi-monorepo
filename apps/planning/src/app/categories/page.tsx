"use client";

import { categoriesAtom } from "@planning/schemas/category";
import { useTable } from "lib";
import { DataTable } from "ui/shared/table";
import { useAtomValue } from "jotai";
import { categoryColumns } from "./columns";
import { CategoryForm } from "./CategoryForm";

export default function Page() {
  const data = useAtomValue(categoriesAtom);

  const { table } = useTable({
    data,
    columns: categoryColumns,
  });

  return (
    <div className="flex flex-col gap-4">
      <CategoryForm />

      <DataTable table={table} />
    </div>
  );
}
