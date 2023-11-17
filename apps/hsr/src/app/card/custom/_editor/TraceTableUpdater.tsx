import {
  __experimental_getNodeType,
  __experimental_traceIconUrl,
} from "@hsr/app/components/Character/TraceTable";
import { groupTrips } from "@hsr/app/components/Character/lineTrips";
import type { Path } from "@hsr/bindings/AvatarConfig";
import type { Anchor, Property } from "@hsr/bindings/SkillTreeConfig";
import { cva } from "class-variance-authority";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { asPercentage, cn } from "lib";
import { Skeleton, Toggle } from "ui/primitive";
import { trpc } from "@hsr/app/_trpc/client";
import type { AvatarTraceSchema } from "database/schema";
import {
  charIdAtom,
  charTraceAtom,
  updateManyCharTraceAtom,
} from "../../_store";

const iconWrapVariants = cva(
  "flex items-center justify-center rounded-full ring-offset-transparent transition duration-500 hover:ring-2 hover:ring-offset-2",
  {
    variants: {
      variant: {
        SMALL: "scale-75 bg-zinc-300",
        BIG: "scale-100 bg-zinc-300",
        CORE: "scale-100 bg-zinc-700",
      },
    },
    defaultVariants: {
      variant: "CORE",
    },
  }
);

interface Prop {
  path: Path;
}

export function TraceTableUpdater({ path }: Prop) {
  const characterId = useAtomValue(charIdAtom);
  const { data: traces, status } = trpc.honkai.avatar.trace.by.useQuery(
    { charId: Number(characterId) },
    { enabled: Boolean(characterId) }
  );
  // const { data: traces, status } = useQuery(characterTraceQ(characterId));
  if (status !== "success") return "loading...";

  const splittedTraces = groupTrips(path);

  return (
    <div className="flex flex-col gap-2">
      {splittedTraces.map((trip, index) => (
        <TripRow
          anchors={trip}
          ascension={(index + 1) * 2}
          key={trip[0]}
          traceInfo={traces}
        />
      ))}
    </div>
  );
}

interface TripRowProps extends HTMLAttributes<HTMLDivElement> {
  anchors: Anchor[];
  traceInfo: AvatarTraceSchema[];
  ascension: number;
}
const TripRow = forwardRef<HTMLDivElement, TripRowProps>(
  ({ anchors, traceInfo, ascension, className, ...props }, ref) => {
    const traces = anchors.map((anchor) =>
      traceInfo.find((e) => e.anchor === anchor)
    );
    const traceDict = useAtomValue(charTraceAtom);
    const updateMany = useSetAtom(updateManyCharTraceAtom);

    function updateCheckMap(checked: boolean, index: number) {
      const rightSideMap = traces
        .filter((e, i) => e && i >= index)
        .map((trace: AvatarTraceSchema, i) => ({
          id: trace.pointId,
          checked: i === 0 ? checked : false,
        }));
      updateMany(rightSideMap);
    }

    return (
      <div className={cn(className, "flex gap-2")} {...props} ref={ref}>
        {traces.map((trace, index) =>
          trace ? (
            <TraceItem
              ascension={ascension}
              atomData={traceDict}
              data={trace}
              index={index}
              key={trace.pointId}
              onUpdateSlice={updateCheckMap}
              previousData={index > 0 ? traces.at(index - 1) : undefined}
            />
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <div className="flex flex-col items-center gap-1 p-1" key={index}>
              <span>...</span>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          )
        )}
      </div>
    );
  }
);
TripRow.displayName = "TripRow";

interface ItemProps {
  index: number;
  data: AvatarTraceSchema;
  previousData: AvatarTraceSchema | undefined;
  atomData: Record<string | number, boolean>;
  onUpdateSlice: (checked: boolean, index: number) => void;
  ascension: number;
}
function TraceItem({
  data,
  previousData,
  atomData,
  index,
  onUpdateSlice,
  ascension,
}: ItemProps) {
  const disabled = !isPreviousChecked(previousData, atomData);
  if (__experimental_getNodeType(data) !== "SMALL")
    return (
      <div className="flex flex-col items-center gap-1 p-1">
        <span>A{ascension}</span>
        <div
          className={iconWrapVariants({
            variant: __experimental_getNodeType(data),
          })}
        >
          <Image
            alt=""
            className={cn(
              "rounded-full",
              __experimental_getNodeType(data) !== "CORE" ? "invert" : ""
            )}
            height={48}
            src={__experimental_traceIconUrl(data)}
            width={48}
          />
        </div>
      </div>
    );

  return (
    <Toggle
      className="flex h-fit flex-col items-center gap-1 p-1"
      disabled={disabled}
      onPressedChange={(checked) => {
        if (__experimental_getNodeType(data) === "SMALL")
          onUpdateSlice(checked, index);
      }}
      pressed={atomData[data.pointId]}
    >
      {isPercentTrace(data.statusAddList?.at(0)?.propertyType)
        ? asPercentage(data.statusAddList?.at(0)?.value)
        : data.statusAddList?.at(0)?.value}

      <div
        className={iconWrapVariants({
          variant: __experimental_getNodeType(data),
        })}
      >
        <Image
          alt=""
          className={cn(
            "rounded-full",
            __experimental_getNodeType(data) !== "CORE" ? "invert" : ""
          )}
          height={48}
          src={__experimental_traceIconUrl(data)}
          width={48}
        />
      </div>
    </Toggle>
  );
}

// TODO:
function isPreviousChecked(
  previousTrace: AvatarTraceSchema | undefined,
  dict: Record<number | string, boolean>
) {
  // ok for first node
  if (!previousTrace) return true;
  // ok for having big parent
  if (__experimental_getNodeType(previousTrace) !== "SMALL") return true;

  return dict[previousTrace.pointId];
}

function isPercentTrace(property: Property | undefined): boolean {
  if (property) {
    switch (property) {
      case "SpeedDelta":
        return false;
      default:
        return true;
    }
  }
  return true;
}
