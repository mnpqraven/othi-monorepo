import Link from "next/link";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { Button } from "ui/primitive";
import { routeDict } from "./tables";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      {routeDict.map((data) => (
        <DictItem data={data} key={data.category.route} />
      ))}
    </div>
  );
}

interface DictProps extends HTMLAttributes<HTMLDivElement> {
  data: (typeof routeDict)[number];
}
const DictItem = forwardRef<HTMLDivElement, DictProps>(function DictItem(
  { data, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref}>
      <p className="py-4 text-xl font-bold">{data.category.name}</p>
      <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
        {data.tables.map((table) => (
          <div className="flex flex-col gap-2" key={table.route}>
            <div className="flex items-center justify-between">
              <span>{table.name}</span>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/table/${data.category.route}/${table.route}`}>
                    Table
                  </Link>
                </Button>
              </div>
            </div>

            {table.api?.map((api) => (
              <Link
                className="text-muted-foreground text-sm"
                href={`/trpc/api/${[data.category.route, table.route, api].join(
                  ".",
                )}`}
                key={api}
              >
                {">"} {api}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
