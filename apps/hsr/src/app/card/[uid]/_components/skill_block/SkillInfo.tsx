import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import type { SkillType } from "@hsr/bindings/AvatarSkillConfig";
import { getImagePath } from "@hsr/lib/utils";
import Image from "next/image";
import { ChevronsUp, Loader2 } from "lucide-react";
import {
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import { charEidAtom, charSkillAtom } from "@hsr/app/card/_store";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn } from "lib/utils";
import type { SkillSchema } from "database/schema";
import { trpc } from "@hsr/app/_trpc/client";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}

export const SkillInfo = forwardRef<HTMLDivElement, Prop>(
  ({ className, characterId, ...props }, ref) => {
    const skList = useAtomValue(charSkillAtom);
    const eidolon = useAtomValue(charEidAtom);

    const [data] = trpc.honkai.skill.by.useSuspenseQuery({
      charId: characterId,
    });

    return (
      <div
        className={cn(
          className,
          "shadow-border flex items-center justify-evenly rounded-md border py-2 shadow-md"
        )}
        ref={ref}
        {...props}
      >
        {Object.entries(splitGroupByType(data, { technique: false })).map(
          ([type, [first, ..._rest]]) =>
            first ? (
              <div className="flex flex-col items-center" key={type}>
                <span>{getLabel2(first.typeDesc ?? "")}</span>
                <SkillIcon
                  skillInfo={first}
                  slv={skList[first.id] ?? 1}
                  src={getImagePath(
                    characterId,
                    first.attackType,
                    first.typeDesc
                  )}
                />
                <span
                  className={cn(
                    "w-full text-center font-bold",
                    isImprovedByEidolon(first.attackType, eidolon)
                      ? "text-[#6cfff7]"
                      : ""
                  )}
                >
                  {skList[first.id] ===
                  getSkillMaxLevel(
                    first.attackType,
                    first.typeDesc ?? "",
                    eidolon
                  ) ? (
                    <span className="flex items-center justify-end">
                      {skList[first.id] ?? 1}
                      <ChevronsUp className="h-4 w-4 text-green-600" />
                    </span>
                  ) : (
                    <span>
                      {skList[first.id] ?? 1} /{" "}
                      {getSkillMaxLevel(
                        first.attackType,
                        first.typeDesc ?? "",
                        eidolon
                      )}
                    </span>
                  )}
                </span>
              </div>
            ) : null
        )}
      </div>
    );
  }
);
SkillInfo.displayName = "SkillInfo";

interface IconProps {
  src: string | undefined;
  skillInfo: SkillSchema;
  slv: number;
  width?: number;
  height?: number;
  className?: string;
}
function SkillIcon({
  src,
  skillInfo,
  slv,
  width = 48,
  height = 48,
  className,
}: IconProps) {
  const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger disabled={hoverVerbosity === "none"}>
        {src ? (
          <Image
            alt={skillInfo.name}
            className={cn("invert dark:invert-0", className)}
            height={height}
            src={src}
            width={width}
          />
        ) : null}
      </TooltipTrigger>
      {hoverVerbosity === "simple" ? (
        <TooltipContent>{skillInfo.name}</TooltipContent>
      ) : null}
      {hoverVerbosity === "detailed" ? (
        <TooltipContent className="w-96 py-2 text-justify text-base">
          <p className="text-accent-foreground mb-2 text-base font-bold">
            {skillInfo.name}
          </p>

          <SkillDescription
            paramList={skillInfo.paramList ?? []}
            skillDesc={skillInfo.skillDesc ?? []}
            slv={slv}
          />
        </TooltipContent>
      ) : null}
    </Tooltip>
  );
}

function getLabel2(typeDesc: string): string {
  switch (typeDesc) {
    case "Basic ATK":
      return "Basic";
    case "Ultimate":
      return "Ult";
    default:
      return typeDesc;
  }
}

export function getSkillMaxLevel(
  skillType: SkillType | null | undefined,
  skillTypeDesc: string,
  eidolon: number
): number {
  if (skillTypeDesc === "Talent") return eidolon >= 5 ? 15 : 10;
  switch (skillType) {
    case "Normal":
      return eidolon >= 3 ? 10 : 6;
    case "BPSkill":
      return eidolon >= 3 ? 15 : 10;
    case "Ultra":
    case "Talent":
      return eidolon >= 5 ? 15 : 10;
    default:
      return 1;
  }
}

function isImprovedByEidolon(
  type: SkillType | null | undefined,
  eidolon: number
): boolean {
  if (!type) return false;
  if (["Normal", "BPSkill"].includes(type) && eidolon >= 3) return true;
  if (["Ultra", "Talent"].includes(type) && eidolon >= 5) return true;
  return false;
}

type Keys = "basic" | "talent" | "skill" | "ult" | "technique";
type ReturnConfig = Partial<Record<Keys, boolean>>;
type Return = {
  [Key in Keys]?: SkillSchema[];
};
function splitGroupByType(data: SkillSchema[], cfg?: ReturnConfig) {
  const _config = {
    basic: true,
    talent: true,
    skill: true,
    ult: true,
    technique: true,
    ...cfg,
  };
  const basic = data.filter((e) => e.attackType === "Normal");
  const talent = data.filter((e) => e.typeDesc === "Talent");
  const skill = data.filter((e) => e.typeDesc === "Skill");
  const ult = data.filter((e) => e.typeDesc === "Ultimate");
  const technique = data.filter((e) => e.typeDesc === "Technique");
  let total: Return = {};
  if (_config.basic) total = { ...total, basic };
  if (_config.skill) total = { ...total, skill };
  if (_config.talent) total = { ...total, talent };
  if (_config.ult) total = { ...total, ult };
  if (_config.technique) total = { ...total, technique };

  return total;
}

export function SkillInfoLoading() {
  const labels = ["Basic", "Skill", "Talent", "Ult"];
  return (
    <div className="shadow-border flex items-center justify-evenly rounded-md border py-2 shadow-md">
      {labels.map((label) => (
        <div className="flex flex-col items-center" key={label}>
          <span>{label}</span>

          <Skeleton className="w-12 h-12 rounded-md" />

          <Loader2 className="animate-spin" />
        </div>
      ))}
    </div>
  );
}
