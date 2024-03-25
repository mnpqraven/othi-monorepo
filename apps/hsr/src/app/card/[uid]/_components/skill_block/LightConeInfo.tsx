import { img } from "@hsr/lib/utils";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
} from "@hsr/app/card/_store";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn } from "lib/utils";
import { trpc } from "protocol";
import { ImpositionIcon } from "../ImpositionIcon";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Prop>(
  ({ className, ...props }, ref) => {
    const ratio = 902 / 1260;

    const lightConeId = useAtomValue(lcIdAtom);
    // const { data: skill } = useQuery(optionLightConeSkill(lightConeId));
    // const { data: lightCone } = useQuery(lightConeMetadataQ(lightConeId));
    const { data: lightCone } = trpc.honkai.lightCone.by.useQuery(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { lcId: lightConeId!, withSkill: true },
      { enabled: Boolean(lightConeId) }
    );
    const skill = lightCone?.skill;

    const level = useAtomValue(lcLevelAtom);
    const ascension = useAtomValue(lcPromotionAtom);
    const imposition = useAtomValue(lcImpositionAtom);

    const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

    const maxLevel = ascension * 10 + 20;

    return (
      <div
        className={cn("flex flex-col items-center", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-[72px] flex-col items-center">
          <span className="font-bold">{lightCone?.name}</span>

          <span className="flex">
            <span className="font-bold">Lv. {level}</span> / {maxLevel}
            <ImpositionIcon className="ml-2.5" imposition={imposition} />
          </span>
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
          {hoverVerbosity !== "none" && skill ? (
            <TooltipContent className="w-96 text-base" side="left">
              <p className="text-accent-foreground mb-2 font-bold">
                {skill.name}
              </p>

              <SkillDescription
                paramList={skill.paramList ?? []}
                skillDesc={skill.desc ?? []}
                slv={imposition - 1}
              />
            </TooltipContent>
          ) : null}
        </Tooltip>
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
