import type { HTMLAttributes } from "react";
import { forwardRef, useMemo } from "react";
import { useAtomValue } from "jotai";
import { RelicBox } from "@hsr/app/card/[uid]/_components/relic_block/RelicBox";
import { configAtom, splitRelicAtom } from "@hsr/app/card/_store";
import { selectAtom } from "jotai/utils";
import { cn } from "lib/utils";
import { SetInfo } from "./SetInfo";

export const RelicInfo = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const baseUrlAtom = useMemo(
    () => selectAtom(configAtom, (o) => o.showBaseUrl),
    []
  );
  const uidAtom = useMemo(() => selectAtom(configAtom, (o) => o.uid), []);

  const showBaseUrl = useAtomValue(baseUrlAtom);
  const uid = useAtomValue(uidAtom);
  const splittedRelics = useAtomValue(splitRelicAtom);

  return (
    <div className={cn("flex flex-col gap-2", className)} ref={ref} {...props}>
      {showBaseUrl ? (
        <span className="text-muted-foreground flex-1 self-end">
          hsr.othi.dev/card{uid ? `/${uid}` : ""}
        </span>
      ) : null}

      <div className={cn("grid grid-cols-2 gap-2 place-self-center")}>
        {splittedRelics.map((atom, index) => (
          <RelicBox atom={atom} key={index} />
        ))}
      </div>

      <SetInfo />
    </div>
  );
});
RelicInfo.displayName = "RelicInfo";
