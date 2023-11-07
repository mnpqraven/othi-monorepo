"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getImagePath, parseSkillType } from "@hsr/lib/utils";
import type {
  AvatarSkillConfig,
  SkillType,
} from "@hsr/bindings/AvatarSkillConfig";
import { Loader2 } from "lucide-react";
import { Separator, Skeleton, Toggle, Slider } from "ui/primitive";
import { useQuery } from "@tanstack/react-query";
import {
  characterSkillQ,
  characterMetadataQ,
} from "@hsr/hooks/queries/character";
import { SkillDescription } from "../Db/SkillDescription";

interface Prop {
  characterId: number;
}
function SkillOverview({ characterId }: Prop) {
  const [selectedSlv, setSelectedSlv] = useState(0);

  const { data: skills } = useQuery(characterSkillQ(characterId));
  const { data: character } = useQuery(characterMetadataQ(characterId));

  const [selectedSkill, setSelectedSkill] = useState<
    AvatarSkillConfig | undefined
  >(
    // skills.find((e) => e.skill_type_desc === "Talent") ?? skills[0]
    undefined
  );

  useEffect(() => {
    if (skills.length > 0) {
      setSelectedSkill(skills.find((e) => e.skill_type_desc === "Talent"));
    }
  }, [skills]);

  const sortedSkills = skills
    .filter(
      (skill) =>
        skill.attack_type !== "Normal" && skill.attack_type !== "MazeNormal"
    )
    .sort((a, b) => {
      const toInt = (ttype: SkillType | null | undefined) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent") return 1;
        return 0;
      };
      return toInt(a.attack_type) - toInt(b.attack_type);
    });

  if (!selectedSkill) return <SkillOverviewLoading />;

  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        <div className="grid grid-cols-4">
          {sortedSkills.map((skill) => (
            <Toggle
              className="flex h-fit flex-col items-center px-1 py-1.5"
              key={skill.skill_id}
              onPressedChange={() => {
                setSelectedSkill(skill);
              }}
              pressed={skill.skill_id === selectedSkill.skill_id}
            >
              {Boolean(getImagePath(characterId, skill)) && (
                <Image
                  alt={skill.skill_name}
                  className="invert dark:invert-0"
                  height={64}
                  src={`${getImagePath(characterId, skill)}`}
                  width={64}
                />
              )}
              <span className="self-center">
                {parseSkillType(skill.attack_type, skill.skill_type_desc)}
              </span>
            </Toggle>
          ))}
        </div>

        <Separator className="my-3 sm:hidden" />

        <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            <span>{selectedSkill.skill_name}</span>
            {selectedSkill.attack_type === "Ultra" &&
              ` (${character?.spneed} Energy)`}
          </h3>
          {selectedSkill.param_list.length > 1 && (
            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap">Lv. {selectedSlv + 1}</span>
              <Slider
                className="py-4"
                defaultValue={[0]}
                max={selectedSkill.param_list.length - 1}
                min={0}
                onValueChange={(e) => {
                  if (e[0]) setSelectedSlv(e[0]);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="mt-2 min-h-[8rem] rounded-md border p-4">
          <SkillDescription
            paramList={selectedSkill.param_list}
            skillDesc={selectedSkill.skill_desc}
            slv={selectedSlv}
          />
        </div>
      </div>
    </div>
  );
}

function SkillOverviewLoading() {
  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        <div className="grid grid-cols-4">
          {["Talent", "Skill", "Ultimate", "Technique"].map((name) => (
            <Toggle
              className="flex h-fit flex-col items-center px-1 py-1.5"
              key={name}
              pressed={name === "Talent"}
            >
              <Skeleton className="h-16 w-16 invert dark:invert-0" />
              <span className="self-center">{name}</span>
            </Toggle>
          ))}
        </div>

        <Separator className="my-3 sm:hidden" />

        <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
          <h3 className="flex items-center justify-start text-lg font-semibold leading-none tracking-tight">
            <Loader2 className="mr-1 animate-spin" />
            Loading...
          </h3>
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap">Lv. 1</span>
            <Slider className="py-4" defaultValue={[0]} max={15} min={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { SkillOverview, SkillOverviewLoading };
