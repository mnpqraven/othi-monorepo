/* eslint-disable @typescript-eslint/no-unnecessary-qualifier */
import type React from "react";

export * from "./DataTable";
export * from "./DataTableMultiSelect";
export * from "./DataTableMultiSelectExpand";
export * from "./DataTablePagination";
export * from "./DataTableToggleColumn";

// Redecalare forwardRef to accept generic types
// INFO: https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = NonNullable<unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
