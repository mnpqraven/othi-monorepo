"use client";

import Image from "next/image";
import { cva } from "class-variance-authority";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import type { Path } from "@hsr/bindings/AvatarConfig";
import { cn } from "lib";
import {
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "ui/primitive";
import { trpc } from "protocol";
import type { AvatarTraceSchema } from "database/schema";
import { propertyIconUrl } from "@hsr/lib/propertyHelper";
import { TraceDescription } from "./TraceDescription";
import { getLineTrips, traceVariants } from "./lineTrips";

interface Prop {
  characterId: number;
  wrapperSize?: number;
  editMode?: boolean;
  onChange?: (data: Record<number, boolean>) => void;
}

function TraceTable({
  characterId,
  wrapperSize = 480,
  editMode = false,
  onChange,
}: Prop) {
  const { data } = trpc.honkai.avatar.by.useQuery({ charId: characterId });
  const [editModeTable, setEditModeTable] = useImmer<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    if (onChange) onChange(editModeTable);
  }, [editModeTable, onChange]);

  function onCheckedChange(checked: boolean, pointId: number) {
    setEditModeTable((draft) => {
      draft[pointId] = checked;
    });
  }

  if (!data) return null;

  const { path, spneed: maxEnergy } = data;

  return (
    <div
      className="relative -mx-8 h-[30rem] w-screen overflow-hidden p-2 sm:mx-0 sm:w-[30rem]"
      id="trace-wrapper"
    >
      <Image
        alt={path}
        className="absolute bottom-0 left-0 right-0 top-0 -z-50 m-auto opacity-10 invert-0 dark:invert-0"
        height={384}
        quality={100}
        src={pathUrl(path)}
        width={384}
      />

      <TraceTableInner
        characterId={characterId}
        editMode={editMode}
        maxEnergy={maxEnergy ?? 0}
        onCheckedChange={onCheckedChange}
        path={path}
        wrapperSize={wrapperSize}
      />
    </div>
  );
}

function TraceTableInner({
  characterId,
  wrapperSize = 480,
  path,
  maxEnergy,
  editMode,
  onCheckedChange,
}: Omit<Prop, "onChange"> & {
  onCheckedChange: (checked: boolean, pointId: number) => void;
  path: Path;
  maxEnergy: number;
}) {
  const updateLines = useXarrow();

  const { data } = trpc.honkai.avatar.trace.by.useQuery(
    { charId: Number(characterId) },
    { enabled: Boolean(characterId) },
  );
  const { data: skills } = trpc.honkai.skill.by.useQuery({
    charId: characterId,
  });

  const iconWrapVariants = cva(
    "flex items-center justify-center rounded-full ring-offset-transparent transition duration-500 hover:ring-2 hover:ring-offset-2",
    {
      variants: {
        variant: {
          SMALL: "scale-50 bg-zinc-300",
          BIG: "scale-[.85] bg-zinc-300",
          CORE: "scale-75 bg-zinc-700",
        },
      },
      defaultVariants: {
        variant: "CORE",
      },
    },
  );

  const iconInnerVariants = cva("rounded-full", {
    variants: {
      variant: {
        SMALL: "scale-75",
        BIG: "invert",
        CORE: "",
      },
    },
    defaultVariants: { variant: "CORE" },
  });

  return (
    <div className="relative h-full w-full" id="parent-wrapper">
      <Xwrapper>
        {data?.map((traceNode) => (
          <div
            className={cn(
              traceVariants(path)({ anchor: traceNode.anchor }),
              "",
            )}
            id={String(traceNode.anchor)}
            key={traceNode.pointId}
            style={{
              marginLeft: `${wrapperSize / -16}px`,
            }}
          >
            {editMode && __experimental_getNodeType(traceNode) === "SMALL" ? (
              <Checkbox
                className="absolute -top-2.5 left-3"
                onCheckedChange={(checked) => {
                  onCheckedChange(
                    checked === "indeterminate" ? false : checked,
                    traceNode.pointId,
                  );
                }}
              />
            ) : null}
            <Popover>
              <PopoverTrigger
                className={iconWrapVariants({
                  variant: __experimental_getNodeType(traceNode),
                })}
              >
                <Image
                  alt={`${traceNode.pointId}`}
                  className={iconInnerVariants({
                    variant: __experimental_getNodeType(traceNode),
                  })}
                  height={wrapperSize / 8}
                  onLoadingComplete={updateLines}
                  src={__experimental_traceIconUrl(traceNode)}
                  style={{
                    // disable icons at the edge getting squished
                    minWidth: `${wrapperSize / 8}px`,
                    minHeight: `${wrapperSize / 8}px`,
                  }}
                  width={wrapperSize / 8}
                />
              </PopoverTrigger>
              <PopoverContent
                className="w-screen sm:w-full"
                style={{ maxWidth: `${wrapperSize}px` }}
              >
                <TraceDescription
                  maxEnergy={maxEnergy}
                  skill={skills?.find((e) => e.id === traceNode.skillId)}
                  trace={traceNode}
                  traceType={__experimental_getNodeType(traceNode)}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}

        {data
          ? getLineTrips(path).map(([a, b]) => (
              <Xarrow
                color="silver"
                curveness={0}
                end={`${b}`}
                endAnchor="middle"
                key={`${a}-${b}`}
                showHead={false}
                start={`${a}`}
                startAnchor="middle"
                strokeWidth={2}
                zIndex={-1}
              />
            ))
          : null}
      </Xwrapper>
    </div>
  );
}

/**
 * get the type of each node
 * @param node -
 * @returns CORE denotes the 4 center nodes (basic, skill, ult, technique)
 * SMALL denotes small nodes in the left
 * BIG denotes unique character traces
 */
export function getNodeType(node: SkillTreeConfig): "CORE" | "SMALL" | "BIG" {
  if (node.icon_path.includes("_SkillTree")) return "BIG";
  if (
    ["Normal.png", "BP.png", "Maze.png", "Passive.png", "Ultra.png"].some(
      (ends) => node.icon_path.endsWith(ends),
    )
  )
    return "CORE";
  return "SMALL";
}

export function __experimental_getNodeType(
  node: AvatarTraceSchema,
): "CORE" | "SMALL" | "BIG" {
  switch (node.pointType) {
    case 2:
      return "CORE";
    case 3:
      return "BIG";
    default:
      return "SMALL";
  }
}

export function __experimental_traceIconUrl(node: AvatarTraceSchema) {
  const base = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon`;
  switch (__experimental_getNodeType(node)) {
    case "CORE": {
      const suffixes = [
        "basic_atk",
        "skill",
        "ultimate",
        "talent",
        "technique",
      ];
      return `${base}/skill/${node.avatarId}_${suffixes.at(
        node.maxLevel !== 1 ? (node.pointId % 10) - 1 : 4,
      )}.png`;
    }
    case "SMALL":
      return propertyIconUrl(
        node.statusAddList?.at(0)?.propertyType ?? "MaxHP",
      );
    case "BIG": {
      return `${base}/skill/${node.avatarId}_skilltree${node.pointId % 10}.png`;
    }
  }
}
export function traceIconUrl(node: SkillTreeConfig) {
  const base = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon`;
  switch (getNodeType(node)) {
    case "CORE": {
      let path = "";
      const mapper = [
        { left: "Normal.png", right: "_basic_atk.png" },
        { left: "Passive.png", right: "_talent.png" },
        { left: "BP.png", right: "_skill.png" },
        { left: "Maze.png", right: "_technique.png" },
        { left: "Ultra.png", right: "_ultimate.png" },
      ];

      mapper.forEach(({ left, right }) => {
        if (node.icon_path.endsWith(left))
          path = `/skill/${node.avatar_id}${right}`;
      });
      return base + path;
    }
    case "SMALL": {
      const lastSlash = node.icon_path.lastIndexOf("/");
      const name = node.icon_path.slice(lastSlash);
      return `${base}/property${name}`;
    }
    case "BIG": {
      // SkillTree1.png
      return `${base}/skill/${node.avatar_id}_${node.icon_path
        .slice(-14)
        .toLowerCase()}`;
    }
  }
}

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}

export { TraceTable };
