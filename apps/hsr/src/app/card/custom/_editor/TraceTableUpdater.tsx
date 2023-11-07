import {
  getNodeType,
  traceIconUrl,
} from "@hsr/app/components/Character/TraceTable";
import { groupTrips } from "@hsr/app/components/Character/lineTrips";
import type { Path } from "@hsr/bindings/AvatarConfig";
import type { Anchor, SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { useCharacterTrace } from "@hsr/hooks/queries/useCharacterTrace";
import { cva } from "class-variance-authority";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { asPercentage, cn } from "lib";
import { Skeleton, Toggle } from "ui/primitive";
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
  const { data: traces, isFetching } = useCharacterTrace(characterId);
  if (isFetching) return "loading...";
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
  traceInfo: SkillTreeConfig[];
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
        .map((trace: SkillTreeConfig, i) => ({
          id: trace.point_id,
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
              key={trace.point_id}
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
  data: SkillTreeConfig;
  previousData: SkillTreeConfig | undefined;
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
  if (getNodeType(data) !== "SMALL")
    return (
      <div className="flex flex-col items-center gap-1 p-1">
        <span>A{ascension}</span>
        <div
          className={iconWrapVariants({
            variant: getNodeType(data),
          })}
        >
          <Image
            alt=""
            className={cn(
              "rounded-full",
              getNodeType(data) !== "CORE" ? "invert" : ""
            )}
            height={48}
            src={traceIconUrl(data)}
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
        if (getNodeType(data) === "SMALL") onUpdateSlice(checked, index);
      }}
      pressed={atomData[data.point_id]}
    >
      {asPercentage(data.status_add_list.at(0)?.value.value)}

      <div
        className={iconWrapVariants({
          variant: getNodeType(data),
        })}
      >
        <Image
          alt=""
          className={cn(
            "rounded-full",
            getNodeType(data) !== "CORE" ? "invert" : ""
          )}
          height={48}
          src={traceIconUrl(data)}
          width={48}
        />
      </div>
    </Toggle>
  );
}

// TODO:
function isPreviousChecked(
  previousTrace: SkillTreeConfig | undefined,
  dict: Record<number | string, boolean>
) {
  // ok for first node
  if (!previousTrace) return true;
  // ok for having big parent
  if (getNodeType(previousTrace) !== "SMALL") return true;

  return dict[previousTrace.point_id];
}
