"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { asPercentage } from "lib/utils";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import type { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import { IMAGE_URL } from "@hsr/lib/constants";

type Haystack = {
  [key in string]?: { value: number; icon: string; label: string };
};

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  skills: SkillTreeConfig[];
  properties: AvatarPropertyConfig[];
}

const TraceSummary = forwardRef<HTMLDivElement, Prop>(
  ({ characterId, skills, properties, ...props }, ref) => {
    const hay: Haystack = {};
    skills.forEach((traceNode) => {
      const property = traceNode.status_add_list[0];

      if (property?.property_type) {
        const {
          property_type: key,
          value: { value },
        } = property;

        // upserting
        if (!hay[key])
          hay[key] = {
            value,
            icon: traceNode.icon_path,
            label: traceNode.point_name,
          };
        else
          hay[key] = {
            value: hay[key]!.value + value,
            icon: traceNode.icon_path,
            label: traceNode.point_name,
          };
      }
    });

    return (
      <div ref={ref} {...props}>
        {Object.keys(hay)
          .sort((a, b) => a.localeCompare(b))
          .map((key, index) => (
            <div className="flex items-center justify-between" key={index}>
              <div className="flex items-center">
                <Image
                  alt={key}
                  className="aspect-square h-8 w-8"
                  height={128}
                  src={propertyUrl(hay[key]?.icon)}
                  width={128}
                />
                {properties.find((e) => e.property_type === key)?.property_name}
              </div>

              <div>{asPercentage(hay[key]?.value)}</div>
            </div>
          ))}
      </div>
    );
  }
);
TraceSummary.displayName = "TraceSummary";

function propertyUrl(icon: string | undefined) {
  const lastSlash = icon?.lastIndexOf("/");
  return `${IMAGE_URL}icon/property${icon?.slice(lastSlash)}`;
}

export { TraceSummary };
