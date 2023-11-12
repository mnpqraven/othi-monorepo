"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Separator, Slider } from "ui/primitive";
import { useSuspenseQuery } from "@tanstack/react-query";
import { characterMetadataQ } from "@hsr/hooks/queries/character";
import type { SkillSchema } from "database/schema";
import { SkillDescription } from "../Db/SkillDescription";

interface Prop {
  characterId: number;
  selectedId: number;
  children?: ReactNode;
  skills: SkillSchema[];
}
export function SkillOverview({
  characterId,
  selectedId,
  skills,
  children,
}: Prop) {
  const [selectedSlv, setSelectedSlv] = useState(0);

  const { data: character } = useSuspenseQuery(characterMetadataQ(characterId));

  const selectedSkill = skills.find((e) => e.id === selectedId);

  useEffect(() => {
    if (
      selectedSkill?.paramList?.length &&
      selectedSkill.paramList.length < selectedSlv
    )
      setSelectedSlv(selectedSkill.paramList.length - 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkill]);

  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        {children}

        <Separator className="my-3 sm:hidden" />

        {selectedSkill ? (
          <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              <span>{selectedSkill.name}</span>
              {selectedSkill.attackType === "Ultra" &&
                ` (${character.spneed} Energy)`}
            </h3>
            {(selectedSkill.paramList ?? []).length > 1 ? (
              <div className="flex items-center gap-4">
                <span className="whitespace-nowrap">Lv. {selectedSlv + 1}</span>
                <Slider
                  className="py-4"
                  defaultValue={[0]}
                  max={(selectedSkill.paramList ?? []).length - 1}
                  min={0}
                  onValueChange={(e) => {
                    if (e[0] !== undefined) setSelectedSlv(e[0]);
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <div className="mt-2 min-h-[8rem] rounded-md border p-4">
          {selectedSkill ? (
            <SkillDescription
              paramList={selectedSkill.paramList ?? []}
              skillDesc={selectedSkill.skillDesc ?? []}
              slv={selectedSlv}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
