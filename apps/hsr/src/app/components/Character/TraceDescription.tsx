import type { AvatarSkillConfig } from "@hsr/bindings/AvatarSkillConfig";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { asPercentage } from "lib/utils";
import { useState } from "react";
import { Slider } from "ui/primitive";
import { SkillDescription } from "../Db/SkillDescription";

interface Prop {
  traceType: "CORE" | "SMALL" | "BIG";
  trace: SkillTreeConfig;
  maxEnergy: number;
  skill: AvatarSkillConfig | undefined;
}
function TraceDescription({ trace, traceType, maxEnergy, skill }: Prop) {
  if (traceType === "SMALL")
    return (
      <span>
        {trace.point_name}:{" "}
        {asPercentage(trace.status_add_list.at(0)?.value.value)}
      </span>
    );

  if (traceType === "BIG")
    return (
      <div className="flex flex-col">
        <div>{trace.point_name}</div>
        <SkillDescription
          paramList={trace.param_list}
          skillDesc={trace.point_desc}
          slv={0}
        />
      </div>
    );

  if (skill)
    return (
      <div className="flex flex-col">
        <SkillDescriptionWrapper maxEnergy={maxEnergy} skill={skill} />
      </div>
    );

  return null;
}

function SkillDescriptionWrapper({
  skill,
  maxEnergy,
}: {
  skill: AvatarSkillConfig;
  maxEnergy: number;
}) {
  const [selectedSlv, setSelectedSlv] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        {skill.skill_name} - {skill.skill_type_desc}
        {skill.attack_type === "Ultra" && ` (${maxEnergy} Energy)`}
      </h3>
      {skill.param_list.length > 1 && (
        <div className="flex items-center">
          <span className="w-24 font-semibold">Level: {selectedSlv + 1}</span>
          <Slider
            className="py-4"
            defaultValue={[0]}
            max={skill.param_list.length - 1}
            min={0}
            onValueChange={(sl) => {
              if (sl[0]) setSelectedSlv(sl[0]);
            }}
          />
        </div>
      )}
      <SkillDescription
        paramList={skill.param_list}
        skillDesc={skill.skill_desc}
        slv={selectedSlv}
      />
    </div>
  );
}

export { TraceDescription };
