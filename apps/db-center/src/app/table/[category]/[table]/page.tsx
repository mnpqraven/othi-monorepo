"use client";

import { useMemo, useState } from "react";
import type {
  ValidTableNames,
  EitherArray,
  ValidTableSchemas,
} from "protocol/trpc/routers/table";
import { DEFAULT_PAGINATION, search, useTable } from "lib";
import { Input, ScrollArea } from "ui/primitive";
import {
  DataTable,
  DataTablePagination,
  DataTableToggleColumn,
} from "ui/shared/table";
import { trpc } from "protocol";
import { keepPreviousData } from "@tanstack/react-query";
import { TABLE_DICT } from "./_data/dataset";
import type { Categories } from "./types";
import { Metadata } from "next";

interface Params {
  params: {
    category: Categories;
    table: ValidTableNames;
  };
}

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function Page({ params }: Params) {
  const { category: _categorySlug, table: tableName } = params;

  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const dict = TABLE_DICT[tableName];

  const { data, isLoading } = trpc.table.list.useQuery(
    { tableName, pagination },
    { placeholderData: keepPreviousData },
  );

  const chunkData = useMemo(
    () =>
      data
        ? search<EitherArray<ValidTableSchemas>[number]>(
            data.data,
            dict?.searchKeys ?? [],
            keyword,
          )
        : [],
    [data, dict?.searchKeys, keyword],
  );

  const { table: tableDef } = useTable({
    data: chunkData,
    // @ts-expect-error inferring multiple column types
    columns: dict?.columns ?? [],
    pageCount: data?.pagination.totalPages,
    pagination: { pagination, setPagination },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          className="w-fit"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="Search"
        />

        <DataTableToggleColumn table={tableDef} />
      </div>

      <ScrollArea>
        <DataTable isLoading={isLoading} spacing="sm" table={tableDef} />
      </ScrollArea>

      <DataTablePagination sizes={[10, 20, 25, 50, 100]} table={tableDef} />
    </div>
  );
}
