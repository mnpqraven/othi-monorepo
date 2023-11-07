"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { useRelicSetBonuses } from "@hsr/hooks/queries/useRelicSetBonus";
import { useRelicSets } from "@hsr/hooks/queries/useRelicSetList";
import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import type { RelicInput } from "@hsr/app/card/_store/relic";
import { relicsStructAtom } from "@hsr/app/card/_store/relic";
import { useAtomValue } from "jotai";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn } from "lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import { RelicSetMarker } from "./RelicSetMarker";

export const SetInfo = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const hoverVerbosity = useAtomValue(hoverVerbosityAtom);
  const relics = useAtomValue(relicsStructAtom);
  const { data: relicBonuses } = useRelicSetBonuses();
  const { data: relicSets } = useRelicSets();

  if (!relicBonuses || !relicSets) return null;

  const activeSets = relicBonuses.filter((e) =>
    relics.map((a) => a.setId).includes(e.set_id)
  );

  const setSummary: { setId: number; num: number; name: string | undefined }[] =
    [];
  activeSets.forEach(({ set_id }) => {
    const currentNum = relics.filter((e) => e.setId === set_id).length;
    const find = relicBonuses.find((e) => e.set_id === set_id);
    if (find) {
      const validIndexed = find.require_num.filter((num) => num <= currentNum);
      if (validIndexed.length) {
        setSummary.push({
          setId: set_id,
          num: Math.max(...validIndexed),
          name: relicSets.find((e) => e.set_id === set_id)?.set_name,
        });
      }
    }
  });

  if (!setSummary.length) return null;

  return (
    <div className="shadow-border gap-2 rounded-md border p-2 shadow-md">
      <Tooltip>
        <TooltipTrigger
          className={cn("flex flex-col", className)}
          disabled={hoverVerbosity === "none"}
          ref={ref}
          {...props}
        >
          {setSummary.sort(bySetId).map(({ name, num }, index) => (
            <div className="flex items-center gap-2" key={index}>
              <RelicSetMarker className="inline-block align-middle" />

              <span className="font-semibold text-green-600">{num}pc</span>

              <span className="ml-2">{name}</span>
            </div>
          ))}
        </TooltipTrigger>
        {hoverVerbosity !== "none" && (
          <TooltipContent
            className="flex w-96 flex-col gap-3 py-2 text-justify text-base"
            side="top"
            sideOffset={25}
          >
            {activeSets.sort(bySetId).map((set, index) =>
              canShow(set.set_id, relics) ? (
                <div className="flex flex-col" key={index}>
                  <p className="text-accent-foreground text-base font-bold">
                    {relicSets.find((e) => e.set_id === set.set_id)?.set_name}
                  </p>

                  {set.require_num.map((pc, index) =>
                    canShow(set.set_id, relics, pc) ? (
                      <div key={index}>
                        <span className="text-green-600">{pc}pc</span>:
                        <SkillDescription
                          paramList={set.ability_param_list}
                          skillDesc={set.skill_desc[index]}
                          slv={0}
                        />
                      </div>
                    ) : null
                  )}
                </div>
              ) : null
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
});
SetInfo.displayName = "SetInfo";

function bySetId<T extends { setId?: number; set_id?: number }>(a: T, b: T) {
  return (a.setId ?? a.set_id ?? 0) - (b.setId ?? b.set_id ?? 0);
}

function canShow(setId: number, relics: RelicInput[], requireNum = 2) {
  return relics.filter((e) => e.setId === setId).length >= requireNum;
}
