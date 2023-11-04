import type { ItemSchema } from "database/schema";
import { createColumnHelper } from "@tanstack/react-table";

const col = createColumnHelper<ItemSchema>();

export const itemColumns = [
  col.display({
    id: "index",
    size: 40,
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {String(row.index + 1).padStart(2, "0")}
      </div>
    ),
  }),
  col.accessor("id", {}),
  col.accessor("itemName", {}),
  col.accessor("rarity", {}),
  col.accessor("itemMainType", {}),
  col.accessor("itemSubType", {}),
  col.accessor("inventoryDisplayTag", {}),
  col.accessor("purposeType", {}),
  col.accessor("itemDesc", {}),
  col.accessor("itemBgdesc", {}),
  col.accessor("pileLimit", {}),
];
