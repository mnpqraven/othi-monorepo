import { Row, Table as TableType, flexRender } from "@tanstack/react-table";
import { ForwardedRef, Fragment, HTMLAttributes, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../primitive/table";
import { Loader2 } from "lucide-react";
import { cn } from "lib/utils";

// Redecalare forwardRef to accept generic types
// INFO: https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = NonNullable<unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

interface Props<TData> extends HTMLAttributes<HTMLDivElement> {
  table: TableType<TData>;
  isLoading?: boolean;
  stickyHeader?: boolean;
  spacing?: "sm" | "md";
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
}

function DataTableInner<TData>(
  {
    table,
    renderSubComponent,
    stickyHeader = false,
    isLoading = false,
    spacing = "md",
    className,
    ...props
  }: Props<TData>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div ref={ref} className={className} {...props}>
      <Table className="border-separate border-spacing-0">
        <TableHeader
          className={cn(
            stickyHeader ? "[&_th]:sticky [&_th]:top-0 [&_th]:bg-muted" : ""
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="border-b border-b-border"
                    style={{
                      width:
                        header.getSize() === Number.MAX_SAFE_INTEGER
                          ? "auto"
                          : header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="[&_td]:border-b [&_td]:border-b-border [&_tr:last-child_td]:border-0">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  // className="[&_td]:border-b [&_td]:border-b-muted-foreground"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={spacing == "sm" ? "p-2" : "p-4"}
                      style={{
                        width:
                          cell.column.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && !!renderSubComponent && (
                  <TableCell
                    colSpan={row.getVisibleCells().length}
                    className={spacing == "sm" ? "p-2" : "p-4"}
                  >
                    {renderSubComponent({ row })}
                  </TableCell>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow className="[&_tr]:border-border">
              <TableCell
                colSpan={table.getAllColumns().length}
                className={cn(
                  "h-24 text-center",
                  spacing == "sm" ? "p-2" : "p-4"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1">
                    <Loader2 className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const DataTable = forwardRef(DataTableInner);
