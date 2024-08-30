import { createColumnHelper } from "@tanstack/react-table";
import type { BlogTag } from "database/schema";
import { Pencil, Trash } from "lucide-react";
import { Button } from "ui/primitive";

const col = createColumnHelper<BlogTag>();

export const blogTagColumns = [
  col.accessor("code", { header: "Code" }),
  col.accessor("label", { header: "Label" }),
  col.display({
    id: "action",
    cell: function Action(_props) {
      return (
        <div className="flex gap-2">
          {/* <Button className="p-2" variant="outline"> */}
          {/*   <Pencil className="h-4 w-4" /> */}
          {/* </Button> */}
          {/* <Button className="p-2" variant="outline"> */}
          {/*   <Trash className="h-4 w-4" /> */}
          {/* </Button> */}
        </div>
      );
    },
  }),
];
