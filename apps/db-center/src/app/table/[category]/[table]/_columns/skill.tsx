import type { SkillSchema } from "database/schema";
import { sanitizeNewline } from "lib";
import { createColumnHelper } from "@tanstack/react-table";

const col = createColumnHelper<SkillSchema>();
export const skillColumns = [
  col.accessor("id", {}),
  col.accessor("name", {}),
  col.accessor("tag", {}),
  col.accessor("typeDesc", {}),
  col.accessor("attackType", {}),
  col.accessor("maxLevel", {}),
  col.accessor("spGain", {}),
  col.accessor("spNeed", {}),
  col.accessor("skillDesc", {
    cell: ({ getValue }) => (
      <div>
        {sanitizeNewline(
          getValue()?.reduce((a, b, i) => {
            const len = getValue()?.length;
            if (len && len - 1 === i) {
              return a + b;
            }
            return `${a + b}(${i + 1})`;
          }, ""),
        )}
      </div>
    ),
  }),
  col.accessor("paramList", {
    cell: ({ getValue }) => (
      <div className="flex flex-col">
        {getValue()?.at(0)?.join(", ")}
        <span>...</span>
        {getValue()?.at(-1)?.join(", ")}
      </div>
    ),
    size: 200,
  }),
];
