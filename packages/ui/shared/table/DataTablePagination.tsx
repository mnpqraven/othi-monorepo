import type { PaginationState, Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Button,
} from "../../primitive";

interface Prop<TData> {
  table: Table<TData>;
  pagination?: PaginationState;
  allowSelect?: boolean;
  sizes?: number[];
  total?: number;
}
export function DataTablePagination<TData>({
  table,
  pagination: controlledPagination,
  allowSelect = false,
  total,
  sizes,
}: Prop<TData>) {
  const options = sizes ?? [10, 20, 30, 40, 50];
  const pagination = controlledPagination ?? table.getState().pagination;

  return (
    <div className="flex items-center justify-between px-2">
      {allowSelect ? (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            // value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
            value={`${pagination.pageSize}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              {/* <SelectValue placeholder={table.getState().pagination.pageSize} /> */}
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {options.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          Page {pagination.pageIndex + 1} of {total ?? table.getPageCount()}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="min-w-max">Go to page</span>
          <Input
            className="w-16"
            min={1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            type="number"
            value={pagination.pageIndex + 1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.setPageIndex(0);
            }}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
            }}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
            }}
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
            }}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
