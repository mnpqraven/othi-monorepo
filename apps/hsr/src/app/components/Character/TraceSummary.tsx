"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { asPercentage } from "lib/utils";
import type { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import type { AvatarTraceSchema } from "database/schema";
import { propertyIconUrl } from "@hsr/lib/propertyHelper";
import type { Property } from "database/types/honkai";

type Haystack = {
  [key in string]?: { property: Property; value: number; label: string };
};

interface Prop extends HTMLAttributes<HTMLDivElement> {
  traces: AvatarTraceSchema[];
  properties: AvatarPropertyConfig[];
}

export const TraceSummary = forwardRef<HTMLDivElement, Prop>(
  ({ traces, properties, ...props }, ref) => {
    const hay: Haystack = {};
    traces.forEach((traceNode) => {
      const property = traceNode.statusAddList?.at(0);

      if (property?.propertyType) {
        const { propertyType: key, value } = property;

        // upserting
        if (!hay[key])
          hay[key] = {
            value,
            property: key,
            label: traceNode.pointName ?? "",
          };
        else
          hay[key] = {
            value: hay[key].value + value,
            property: key,
            label: traceNode.pointName ?? "",
          };
      }
    });

    return (
      <div ref={ref} {...props}>
        {Object.keys(hay)
          .sort((a, b) => a.localeCompare(b))
          .map((key) => (
            <div className="flex items-center justify-between" key={key}>
              <div className="flex items-center gap-1">
                <Image
                  alt={key}
                  className="aspect-square h-6 w-6 invert"
                  height={128}
                  src={propertyIconUrl(hay[key]?.property ?? "MaxHP")}
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
