"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface Props<TData> {
  /**
   * @param data must be stable
   * @example
   * ```typescript
   * const { userList } = useUsers();
   * const data = useMemo(() => userList ?? [], [userList]);
   *
   * const { table } = useTable({ data, columns, });
   * ```
   *
   * @link https://github.com/TanStack/table/issues/4566
   * */
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageCount?: number;
  initialState?: InitialTableState | undefined;
  columnFilters?: {
    columnFilters: ColumnFiltersState;
    setColumnFilters: OnChangeFn<ColumnFiltersState> | undefined;
  };
  rowSelection?: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState> | undefined;
  };
  pagination?: {
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState> | undefined;
  };
}

export function useTable<TData>({
  data,
  columns,
  initialState,
  pageCount,
  columnFilters: controlledColumnFilters,
  rowSelection: controlledRowSelection,
  pagination: controlledPagination,
}: Props<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });

  const table = useReactTable({
    // see: https://github.com/TanStack/table/issues/4566
    data,
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    // NOTE: all rows can be expanded, this might be the desired behaviour
    // since we want full JSON data on all events
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: !controlledPagination
      ? getPaginationRowModel()
      : undefined,
    pageCount,

    // pass state to let the hook manage data
    onColumnFiltersChange:
      controlledColumnFilters?.setColumnFilters ?? setColumnFilters,
    onRowSelectionChange:
      controlledRowSelection?.setRowSelection ?? setRowSelection,
    onPaginationChange: controlledPagination?.setPagination ?? setPagination,
    manualPagination: !!controlledPagination,

    initialState,

    state: {
      columnFilters: controlledColumnFilters?.columnFilters ?? columnFilters,
      rowSelection: controlledRowSelection?.rowSelection ?? rowSelection,
      pagination: controlledPagination?.pagination ?? pagination,
    },
  });

  return { table };
}
