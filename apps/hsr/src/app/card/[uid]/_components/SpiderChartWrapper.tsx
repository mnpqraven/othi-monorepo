import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { ParentSize } from "@visx/responsive";
import * as z from "zod";
import type { Element } from "@hsr/bindings/AvatarConfig";
import {
  prettyProperty,
  propertyIconUrl,
  sortByProperty,
} from "@hsr/lib/propertyHelper";
import type { Property } from "@hsr/bindings/SkillTreeConfig";
import { useStatParser } from "@hsr/hooks/useStatParser";
import { useAtomValue } from "jotai";
import { cn, rotate } from "lib/utils";
import { optionLightConePromotion } from "@hsr/hooks/queries/lightcone";
import { useQuery } from "@tanstack/react-query";
import { characterPromotionQ } from "@hsr/hooks/queries/character";
import { charIdAtom, lcIdAtom, statParseParam } from "../../_store";
import { filterOtherElements } from "./stat_block/StatTable";
import { getNormalizedBoundProperty } from "./useDataProcess";
import { SpiderChart } from "./SpiderChart";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  element: Element;
}
export const SpiderChartWrapper = forwardRef<HTMLDivElement, Prop>(
  ({ className, element, ...props }, ref) => {
    const charId = useAtomValue(charIdAtom);
    const lcId = useAtomValue(lcIdAtom);
    const parseParams = useAtomValue(statParseParam);
    const parsedStats = useStatParser(parseParams);
    const { data: charPromo } = useQuery(characterPromotionQ(charId));
    const { data: lcPromo } = useQuery(optionLightConePromotion(lcId));

    if (!parsedStats || !charPromo || !lcPromo) return null;

    const speed = parsedStats.baseValues.speed;

    const binding = Object.entries(parsedStats.statTable)
      .map(([property, value]) => {
        let binding = value;
        switch (property as Property) {
          case "MaxHP":
            binding = parsedStats.normalized.hp;
            break;
          case "Attack":
            binding = parsedStats.normalized.atk;
            break;
          case "Defence":
            binding = parsedStats.normalized.def;
            break;
          case "Speed":
            binding = value - speed;
            break;
          default:
            break;
        }
        const normalizedValue =
          binding / getNormalizedBoundProperty(property as Property, speed);

        return {
          property,
          value,
          normalizedValue,
        };
      })
      .sort((a, b) =>
        sortByProperty(a.property as Property, b.property as Property)
      )
      .filter(({ property }) => filterOtherElements(property, element))
      .reverse() as {
      property: Property;
      value: number;
      normalizedValue: number;
    }[];

    const data = rotate(binding.length / 2 + 2, binding);

    return (
      <div
        className={cn("relative h-[300px] w-full", className)}
        ref={ref}
        {...props}
      >
        <ParentSize debounceTime={10}>
          {(parent) => (
            <SpiderChart
              data={data}
              height={parent.height}
              iconAccessor={(e: (typeof data)[number]) =>
                propertyIconUrl(e.property)
              }
              tooltipRender={({ property, value }: (typeof data)[number]) => {
                const { label, prettyValue } = prettyProperty(property, value);
                return `${label}: ${prettyValue}`;
              }}
              valueAccessor={(e: (typeof data)[number]) => e.normalizedValue}
              width={parent.width}
            />
          )}
        </ParentSize>
      </div>
    );
  }
);

// existing fields:
const FIELDS = [
  "hp",
  "atk",
  "def",
  "spd",
  "crit_rate",
  "crit_dmg",
  "break_dmg",
  "heal_rate",
  "sp_rate",
  "effect_hit",
  "effect_res",
  "lightning_dmg",
  "wind_dmg",
  "fire_dmg",
  "quantum_dmg",
  "imaginary_dmg",
  "ice_dmg",
  "physical_dmg",
  "all_dmg",
] as const;
const zField = z.enum(FIELDS);
export type Field = z.infer<typeof zField>;

export function propertyPath(field: Field): string {
  const prefix = (val: string) => `/property/Icon${val}.svg`;
  switch (field) {
    case "hp":
      return prefix("MaxHP");
    case "atk":
      return prefix("Attack");
    case "def":
      return prefix("Defence");
    case "spd":
      return prefix("Speed");
    case "crit_rate":
      return prefix("CriticalChance");
    case "crit_dmg":
      return prefix("CriticalDamage");
    case "break_dmg":
      return prefix("BreakUp");
    case "heal_rate":
      return prefix("HealRatio");
    case "sp_rate":
      return prefix("EnergyRecovery");
    case "effect_hit":
      return prefix("StatusProbability");
    case "effect_res":
      return prefix("StatusResistance");
    case "lightning_dmg":
      return prefix("ThunderAddedRatio");
    case "wind_dmg":
      return prefix("WindAddedRatio");
    case "fire_dmg":
      return prefix("FireAddedRatio");
    case "quantum_dmg":
      return prefix("QuantumAddedRatio");
    case "imaginary_dmg":
      return prefix("ImaginaryAddedRatio");
    case "ice_dmg":
      return prefix("IceAddedRatio");
    case "physical_dmg":
      return prefix("PhysicalAddedRatio");
    case "all_dmg":
      return prefix("AllDamageTypeAddedRatio");
  }
}

SpiderChartWrapper.displayName = "SpiderChartWrapper";
