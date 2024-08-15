import { useReducerAtom } from "@planning/hooks/useReducerAtom";
import type { Category } from "@planning/schemas/category";
import { categoriesAtom, categoryReducer } from "@planning/schemas/category";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "ui/primitive";
import { ConfirmPopover } from "ui/shared/ConfirmPopover";

const col = createColumnHelper<Category>();

export const categoryColumns = [
  col.accessor("id", { header: "ID" }),
  col.accessor("name", { header: "Name" }),
  col.accessor("type", { header: "Type" }),
  col.display({
    id: "action",
    cell: function Action(props) {
      const id = props.row.index;
      const [_, dispatch] = useReducerAtom(categoriesAtom, categoryReducer);
      function onDelete() {
        dispatch({ type: "remove", payload: { id } });
      }

      return (
        <ConfirmPopover asChild onConfirm={onDelete}>
          <Button className="p-2" variant="outline">
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmPopover>
      );
    },
  }),
];
