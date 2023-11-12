import { useAtom, useAtomValue } from "jotai";
import type {
  AvatarSkillConfig,
  SkillType,
} from "@hsr/bindings/AvatarSkillConfig";
import { getImagePath } from "@hsr/lib/utils";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { forwardRef, useEffect, useMemo } from "react";
import { Badge, Input, Label } from "ui/primitive";
import { cn } from "lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { characterSkillQ } from "@hsr/hooks/queries/character";
import { getSkillMaxLevel } from "../../[uid]/_components/skill_block/SkillInfo";
import {
  charEidAtom,
  charIdAtom,
  charLevelAtom,
  charMaxLevelAtom,
  charPromotionAtom,
  charSkillAtom,
  maxLevelAtom,
} from "../../_store/character";

const skillTypeMap = [
  { skillTypeDesc: "Basic ATK", label: "Basic" },
  { skillTypeDesc: "Talent", label: "Talent" },
  { skillTypeDesc: "Skill", label: "Skill" },
  { skillTypeDesc: "Ultimate", label: "Ult" },
];

export function CharacterUpdater() {
  const charId = useAtomValue(charIdAtom);
  const { data: skills } = useSuspenseQuery(characterSkillQ(charId));
  const maxLevel = useAtomValue(charMaxLevelAtom);

  const sortedSkills = skills
    .filter(
      ({ attack_type }) =>
        attack_type !== "MazeNormal" && attack_type !== "Maze"
    )
    .filter(({ skill_tag }) => skill_tag !== "Cancel")
    .sort((a, b) => {
      const toInt = (ttype: SkillType | null | undefined, typeDesc: string) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent" || typeDesc === "Talent") return 1;
        return 0;
      };
      return (
        toInt(a.attack_type, a.skill_type_desc) -
        toInt(b.attack_type, b.skill_type_desc)
      );
    });

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="level">Level</Label>
          <LevelInput id="level" />
          <span>/{maxLevel}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="promotion">Ascension</Label>
          <PromotionInput id="promotion" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="eidolon">Eidolon</Label>
          <EidolonInput id="eidolon" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {skillTypeMap.map(({ skillTypeDesc, label }) => (
          <SkillSection
            charId={charId}
            data={sortedSkills.filter(
              (e) => e.skill_type_desc === skillTypeDesc
            )}
            key={skillTypeDesc}
            label={label}
          />
        ))}
      </div>
    </div>
  );
}

const LevelInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const maxLevel = useAtomValue(maxLevelAtom);
  const [level, setLevel] = useAtom(charLevelAtom);

  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={maxLevel}
      min={1}
      onChange={(e) => {
        const val = Number(e.currentTarget.value);
        if (val >= 1 && val <= maxLevel) setLevel(val);
        else if (val === 0) setLevel(1);
      }}
      type="number"
      value={level}
      {...props}
      ref={ref}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [ascension, setAscension] = useAtom(charPromotionAtom);
  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={6}
      min={0}
      onChange={(e) => {
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setAscension(val);
      }}
      type="number"
      value={ascension}
      {...props}
      ref={ref}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const EidolonInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [eidolon, setEidolon] = useAtom(charEidAtom);
  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={6}
      min={0}
      onChange={(e) => {
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setEidolon(val);
      }}
      type="number"
      value={eidolon}
      {...props}
      ref={ref}
    />
  );
});
EidolonInput.displayName = "EidolonInput";

function SkillSection({
  charId,
  data,
  label,
}: {
  charId: number | undefined;
  data: AvatarSkillConfig[];
  label: string;
}) {
  const eidolon = useAtomValue(charEidAtom);
  const maxLv = useMemo(
    () =>
      data[0]
        ? getSkillMaxLevel(
            data[0].attack_type,
            data[0].skill_type_desc,
            eidolon
          )
        : 10,
    [data, eidolon]
  );

  return (
    <div className="h-20">
      {data[0] ? (
        <div className="flex gap-2">
          <Image
            alt={`${data[0].skill_id}`}
            className="h-16 w-16 invert dark:invert-0"
            height={64}
            src={`${getImagePath(
              charId,
              data[0].attack_type,
              data[0].skill_type_desc
            )}`}
            width={64}
          />
          <div className="flex flex-col gap-2">
            <Badge className="w-fit">{label}</Badge>
            <SkillInput id={data[0].skill_id} maxLv={maxLv} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SkillInput({ id, maxLv }: { id: number; maxLv: number }) {
  const [charSkill, setCharSkill] = useAtom(charSkillAtom);
  useEffect(() => {
    if (!charSkill[id]) updateSkill(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSkill(to: number) {
    setCharSkill((draft) => {
      draft[id] = to;
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-12"
        max={maxLv}
        min={1}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val > 0) updateSkill(val);
          else if (val === 0) updateSkill(1);
        }}
        type="number"
        value={charSkill[id]}
      />
      <span> / {maxLv}</span>
    </div>
  );
}
