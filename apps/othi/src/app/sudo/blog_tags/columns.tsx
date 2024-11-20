import { createColumnHelper } from "@tanstack/react-table";
import type { BlogTag } from "database/schema";

const col = createColumnHelper<BlogTag>();

export const blogTagColumns = [
  col.accessor("code", { header: "Code" }),
  col.accessor("label", { header: "Label" }),
];
