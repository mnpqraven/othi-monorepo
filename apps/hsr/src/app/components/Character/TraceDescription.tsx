import { asPercentage } from "lib/utils";
import { useState } from "react";
import { Slider } from "ui/primitive";
import type { AvatarTraceSchema, SkillSchema } from "database/schema";
import { SkillDescription } from "../Db/SkillDescription";

interface Prop {
  traceType: "CORE" | "SMALL" | "BIG";
  trace: AvatarTraceSchema;
  maxEnergy: number;
  skill: SkillSchema | undefined;
}
function TraceDescription({ trace, traceType, maxEnergy, skill }: Prop) {
  if (traceType === "SMALL")
    return (
      <span>
        {trace.pointName}: {asPercentage(trace.statusAddList?.at(0)?.value)}
      </span>
    );

  if (traceType === "BIG")
    return (
      <div className="flex flex-col">
        <div>{trace.pointName}</div>
        <SkillDescription
          paramList={trace.paramList ?? []}
          skillDesc={trace.pointDesc ?? []}
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
  skill: SkillSchema;
  maxEnergy: number;
}) {
  const [selectedSlv, setSelectedSlv] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        {skill.name} - {skill.typeDesc}
        {skill.attackType === "Ultra" && ` (${maxEnergy} Energy)`}
      </h3>
      {skill.paramList?.length && skill.paramList.length > 1 ? (
        <div className="flex items-center">
          <span className="w-24 font-semibold">Level: {selectedSlv + 1}</span>
          <Slider
            className="py-4"
            defaultValue={[0]}
            max={skill.paramList.length - 1}
            min={0}
            onValueChange={(sl) => {
              if (sl[0]) setSelectedSlv(sl[0]);
            }}
          />
        </div>
      ) : null}
      <SkillDescription
        paramList={skill.paramList ?? []}
        skillDesc={skill.skillDesc ?? []}
        slv={selectedSlv}
      />
    </div>
  );
}

export { TraceDescription };
