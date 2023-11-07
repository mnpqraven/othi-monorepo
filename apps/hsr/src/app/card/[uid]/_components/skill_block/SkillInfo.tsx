import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import type {
  AvatarSkillConfig,
  SkillType,
} from "@hsr/bindings/AvatarSkillConfig";
import { getImagePath } from "@hsr/lib/utils";
import Image from "next/image";
import { ChevronsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import { charEidAtom, charSkillAtom } from "@hsr/app/card/_store";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn } from "lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { characterSkillQ } from "@hsr/hooks/queries/character";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}

export const SkillInfo = forwardRef<HTMLDivElement, Prop>(
  ({ className, characterId, ...props }, ref) => {
    const skList = useAtomValue(charSkillAtom);
    const eidolon = useAtomValue(charEidAtom);

    const { data } = useSuspenseQuery(characterSkillQ(characterId));

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
                <span>{getLabel2(first.skill_type_desc)}</span>
                <SkillIcon
                  skillInfo={first}
                  slv={skList[first.skill_id] ?? 1}
                  src={getImagePath(characterId, first)}
                />
                <span
                  className={cn(
                    "w-full text-center font-bold",
                    isImprovedByEidolon(first.attack_type, eidolon)
                      ? "text-[#6cfff7]"
                      : ""
                  )}
                >
                  {skList[first.skill_id] ===
                  getSkillMaxLevel(
                    first.attack_type,
                    first.skill_type_desc,
                    eidolon
                  ) ? (
                    <span className="flex items-center justify-end">
                      {skList[first.skill_id] ?? 1}
                      <ChevronsUp className="h-4 w-4 text-green-600" />
                    </span>
                  ) : (
                    <span>
                      {skList[first.skill_id] ?? 1} /{" "}
                      {getSkillMaxLevel(
                        first.attack_type,
                        first.skill_type_desc,
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
  skillInfo: AvatarSkillConfig;
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
            alt={skillInfo.skill_name}
            className={cn("invert dark:invert-0", className)}
            height={height}
            src={src}
            width={width}
          />
        ) : null}
      </TooltipTrigger>
      {hoverVerbosity === "simple" ? (
        <TooltipContent>{skillInfo.skill_name}</TooltipContent>
      ) : null}
      {hoverVerbosity === "detailed" ? (
        <TooltipContent className="w-96 py-2 text-justify text-base">
          <p className="text-accent-foreground mb-2 text-base font-bold">
            {skillInfo.skill_name}
          </p>

          <SkillDescription
            paramList={skillInfo.param_list}
            skillDesc={skillInfo.skill_desc}
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
function getLabel(skillType: SkillType | null | undefined): string {
  switch (skillType) {
    case "Normal":
      return "Basic";
    case "BPSkill":
      return "Skill";
    case "Ultra":
      return "Ult";
    case "Talent":
      return "Talent";
    default:
      return "";
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
  [Key in Keys]?: AvatarSkillConfig[];
};
function splitGroupByType(data: AvatarSkillConfig[], cfg?: ReturnConfig) {
  const _config = {
    basic: true,
    talent: true,
    skill: true,
    ult: true,
    technique: true,
    ...cfg,
  };
  const basic = data.filter((e) => e.attack_type === "Normal");
  const talent = data.filter((e) => e.skill_type_desc === "Talent");
  const skill = data.filter((e) => e.skill_type_desc === "Skill");
  const ult = data.filter((e) => e.skill_type_desc === "Ultimate");
  const technique = data.filter((e) => e.skill_type_desc === "Technique");
  let total: Return = {};
  if (_config.basic) total = { ...total, basic };
  if (_config.skill) total = { ...total, skill };
  if (_config.talent) total = { ...total, talent };
  if (_config.ult) total = { ...total, ult };
  if (_config.technique) total = { ...total, technique };

  return total;
}
