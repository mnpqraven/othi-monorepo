"use client";

import Image from "next/image";
import { cva } from "class-variance-authority";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { useTheme } from "next-themes";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { useCharacterTrace } from "@hsr/hooks/queries/useCharacterTrace";
import { useCharacterSkill } from "@hsr/hooks/queries/useCharacterSkill";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { useCharacterMetadata } from "@hsr/hooks/queries/useCharacterMetadata";
import type { Path } from "@hsr/bindings/AvatarConfig";
import { cn } from "lib";
import {
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "ui/primitive";
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
  const { data } = useCharacterMetadata(characterId);
  const [editModeTable, setEditModeTable] = useImmer<Record<number, boolean>>(
    {}
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

  const { avatar_base_type: path, spneed: maxEnergy } = data;

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
        maxEnergy={maxEnergy}
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
  const { theme } = useTheme();

  const { data } = useCharacterTrace(characterId);
  const { data: skills } = useCharacterSkill(characterId);

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
    }
  );

  return (
    <div className="relative h-full w-full" id="parent-wrapper">
      <Xwrapper>
        {data?.map((traceNode) => (
          <div
            className={cn(
              traceVariants(path)({ anchor: traceNode.anchor }),
              ""
            )}
            id={traceNode.anchor}
            key={traceNode.point_id}
            style={{
              marginLeft: `${wrapperSize / -16}px`,
            }}
          >
            {editMode && getNodeType(traceNode) === "SMALL" ? (
              <Checkbox
                className="absolute -top-2.5 left-3"
                id={traceNode.point_id.toString()}
                onCheckedChange={(checked) => {
                  onCheckedChange(
                    checked === "indeterminate" ? false : checked,
                    traceNode.point_id
                  );
                }}
              />
            ) : null}
            <Popover>
              <PopoverTrigger
                className={iconWrapVariants({
                  variant: getNodeType(traceNode),
                })}
              >
                <Image
                  alt={`${traceNode.point_id}`}
                  className={cn(
                    "rounded-full",
                    getNodeType(traceNode) !== "CORE" ? "scale-90 invert" : ""
                  )}
                  height={wrapperSize / 8}
                  onLoadingComplete={updateLines}
                  src={traceIconUrl(traceNode)}
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
                  skill={skills.find(
                    (e) => e.skill_id === traceNode.level_up_skill_id[0]
                  )}
                  trace={traceNode}
                  traceType={getNodeType(traceNode)}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}

        {data
          ? getLineTrips(path).map(([a, b], index) => (
              <Xarrow
                color={theme !== "dark" ? "black" : "white"}
                curveness={0}
                end={b!}
                endAnchor="middle"
                key={index}
                showHead={false}
                start={a!}
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
      (ends) => node.icon_path.endsWith(ends)
    )
  )
    return "CORE";
  return "SMALL";
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
