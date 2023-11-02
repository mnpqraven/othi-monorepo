import { Button } from "@/components/ui/button";
import Link from "next/link";
import { routeDict } from "./tables";
import { HTMLAttributes, forwardRef } from "react";
import { ClientTest } from "./honkai/avatar/ClientTest";

export default function Home() {
  return (
    <>
      <ClientTest />
      <div className="flex flex-col gap-4">
        {routeDict.map((data, index) => (
          <DictItem key={index} data={data} />
        ))}
      </div>
    </>
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
      <div className="flex flex-col gap-4 rounded-md border p-4">
        {data.tables.map((table, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <div className="flex items-center justify-between">
              <span>{table.name}</span>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={data.category.route + "/" + table.route}>
                    Table
                  </Link>
                </Button>
              </div>
            </div>

            {table.api?.map((api) => (
              <Link
                key={api}
                href={
                  "/api/" + [data.category.route, table.route, api].join(".")
                }
                className="text-sm text-muted-foreground"
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
