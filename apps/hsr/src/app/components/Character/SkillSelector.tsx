import { getImagePath, parseSkillType } from "@hsr/lib/utils";
import { cn } from "lib";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { Toggle } from "ui/primitive";
import { type SkillSchema } from "database/schema";
import Image from "next/image";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  skills: SkillSchema[];
  selectedId: number;
}
export const SkillSelector = forwardRef<HTMLDivElement, Prop>(
  function SkillSelector(
    { className, skills, selectedId, characterId, ...props },
    ref,
  ) {
    return (
      <div
        className={cn("grid grid-cols-5 gap-2", className)}
        ref={ref}
        {...props}
      >
        {skills.map((skill) => (
          <Toggle
            asChild
            className="flex h-fit flex-col items-center px-1 py-1.5"
            key={skill.id}
            pressed={skill.id === selectedId}
          >
            <Link
              href={{
                query: { tab: "skill", id: skill.id, chara: characterId },
              }}
            >
              {getImagePath(characterId, skill.attackType, skill.typeDesc) && (
                <Image
                  alt={skill.name}
                  className="invert dark:invert-0"
                  height={64}
                  src={`${getImagePath(
                    characterId,
                    skill.attackType,
                    skill.typeDesc,
                  )}`}
                  width={64}
                />
              )}
              <span className="self-center">
                {parseSkillType(skill.attackType, skill.typeDesc ?? "")}
              </span>
            </Link>
          </Toggle>
        ))}
      </div>
    );
  },
);
