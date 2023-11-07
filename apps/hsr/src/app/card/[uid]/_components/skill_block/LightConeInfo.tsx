import { img } from "@hsr/lib/utils";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { useLightConeSkill } from "@hsr/hooks/queries/useLightConeSkill";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import { useLightConeMetadata } from "@hsr/hooks/queries/useLightConeMetadata";
import { useAtomValue } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
} from "@hsr/app/card/_store";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn } from "lib/utils";
import { ImpositionIcon } from "../ImpositionIcon";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Prop>(
  ({ displayStat = false, className, ...props }, ref) => {
    const ratio = 902 / 1260;

    const lightConeId = useAtomValue(lcIdAtom);
    const { data: skill } = useLightConeSkill(lightConeId);
    const { lightCone } = useLightConeMetadata(lightConeId);

    const level = useAtomValue(lcLevelAtom);
    const ascension = useAtomValue(lcPromotionAtom);
    const imposition = useAtomValue(lcImpositionAtom);

    const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

    if (!lightCone) return null;

    const { equipment_name: name } = lightCone;
    const maxLevel = ascension * 10 + 20;

    if (!lightConeId) return null;

    return (
      <div
        className={cn("flex flex-col items-center", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-[72px] flex-col items-center">
          <span className="font-bold">{name}</span>

          <span className="flex">
            <span className="font-bold">Lv. {level}</span> / {maxLevel}
            <ImpositionIcon className="ml-2.5" imposition={imposition} />
          </span>

          {/*displayStat && (
            <div className="flex">
              {attributes.map((attr) => (
                <div key={attr.field} className="flex items-center">
                  <Image src={img(attr.icon)} alt="" width={32} height={32} />
                  {attr.display}
                </div>
              ))}
            </div>
          )*/}
        </div>

        <Tooltip>
          <TooltipTrigger disabled={hoverVerbosity === "none"}>
            <Image
              alt=""
              className="shadow-border justify-self-end shadow-xl"
              height={350}
              src={img(`image/light_cone_portrait/${lightConeId}.png`)}
              width={350 * ratio}
            />
          </TooltipTrigger>
          {hoverVerbosity !== "none" && Boolean(skill) && (
            <TooltipContent className="w-96 text-base" side="left">
              <p className="text-accent-foreground mb-2 font-bold">
                {skill.skill_name}
              </p>

              <SkillDescription
                paramList={skill.param_list}
                skillDesc={skill.skill_desc}
                slv={imposition - 1}
              />
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
