/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import type { Property } from "@hsr/bindings/SkillTreeConfig";
import type { Element } from "@hsr/bindings/PatchBanner";
import { asPercentage, rotate } from "lib";
import { useQuery } from "@tanstack/react-query";
import { optionLightConePromotion } from "@hsr/hooks/queries/lightcone";
import type { AvatarPromotionSchema } from "database/schema";
import { trpc } from "protocol";
import type { MihomoCharacter } from "../../types";
import type { Field } from "./SpiderChartWrapper";

const accumulator: { [k in Field]: Field[] } = {
  hp: ["hp"],
  atk: ["atk"],
  def: ["def"],
  effect_hit: ["effect_hit"],
  effect_res: ["effect_res"],
  all_dmg: ["all_dmg"],
  spd: ["spd"],
  crit_rate: ["crit_rate"],
  crit_dmg: ["crit_dmg"],
  break_dmg: ["break_dmg"],
  sp_rate: ["sp_rate"],
  heal_rate: ["heal_rate"],
  fire_dmg: ["fire_dmg", "all_dmg"],
  physical_dmg: ["physical_dmg", "all_dmg"],
  wind_dmg: ["wind_dmg", "all_dmg"],
  lightning_dmg: ["lightning_dmg", "all_dmg"],
  imaginary_dmg: ["imaginary_dmg", "all_dmg"],
  quantum_dmg: ["quantum_dmg", "all_dmg"],
  ice_dmg: ["ice_dmg", "all_dmg"],
};

interface Prop {
  character: MihomoCharacter | undefined;
}

export interface StatRadarData {
  field: Field;
  value: number;
  label: string;
  tooltipValue: string | number;
}

/**
 * This hook will perform the following tasks
 * - get the current character and light cone's stat at the current levels
 * - normalize sum data across the board for radar chart
 * */
export function useDataProcess({ character }: Prop): {
  data: StatRadarData[];
} {
  // INFO: calc order + formula
  // base char stat + lc:
  // trace
  // main stat's impact from relic on stats (flat + %)
  // sub stat's impact from relic on stats (flat + %)
  // normalize summed data
  const { data: charPromo } = trpc.honkai.avatar.promotions.by.useQuery(
    { charId: Number(character?.id) },
    { enabled: Boolean(character?.id) },
  );

  // characterPromotionQ(character?.id ? Number(character.id) : undefined)
  const { data: lcPromo } = useQuery(
    optionLightConePromotion(Number(character?.light_cone?.id)),
  );

  if (charPromo && character && lcPromo) {
    const currentGreyChar = charAfterPromotion({
      promotionConfig: charPromo,
      ascension: character.promotion,
      level: character.level,
    });
    const currentGreyLc = lcAfterPromotion({
      promotionConfig: lcPromo,
      ascension: character.light_cone?.promotion,
      level: character.light_cone?.level,
    });
    const maxedGreyChar = charAfterPromotion({ promotionConfig: charPromo });
    const maxedGreyLc = lcAfterPromotion({ promotionConfig: lcPromo });

    const { additions, attributes } = character;
    const data: StatRadarData[] = [];
    Object.entries(accumulator).forEach((entry) => {
      const [key, list] = entry as [Field, Field[]];
      const addition = additions.filter((e) => list.includes(e.field));
      const attribute = attributes.filter((e) => list.includes(e.field));

      // grey value
      const attributeSum = attribute.reduce((a, b) => a + b.value, 0);
      // blue value
      const additionSum = addition.reduce((a, b) => a + b.value, 0);

      // final ratio = (grey value + blue value) / grey value @ lv80

      // console.log('key: ', key, 'addition: ', addition, 'attribute: ', attribute)
      const normalizedValue = normalizeKeyValue(
        key,
        additionSum,
        attributeSum,
        {
          currentGreyChar,
          currentGreyLc,
          maxedGreyChar,
          maxedGreyLc,
        },
      );

      const label = getFieldLabel(key);

      let tooltipValue = "";

      if (["atk", "def", "hp"].includes(key)) {
        tooltipValue = (additionSum + attributeSum).toFixed(0);
      } else if (key === "spd") {
        tooltipValue = (additionSum + attributeSum).toFixed(1);
      } else {
        tooltipValue = asPercentage(additionSum + attributeSum);
      }

      data.push({
        field: key,
        // 2nd argument (attributeSum) is spd value for spd case
        value: normalizedValue / getNormalizedBound(key, attributeSum),
        label,
        tooltipValue,
      });
    });

    // apply rotation to outcoming data to have correct positions on the chart
    const preRotate = data
      .sort(
        (fieldA, fieldB) =>
          getSortValue(fieldA.field) - getSortValue(fieldB.field),
      )
      .filter(filterFieldsByRole(character.element.name))
      .filter(filterEmptyValues())
      .reverse();

    return {
      data: rotate(preRotate.length / 2, preRotate),
    };
  }

  function normalizeKeyValue<
    T extends { atk: number; def: number; hp: number },
  >(
    key: Field,
    additionSum: number,
    attributeSum: number,
    {
      currentGreyChar,
      currentGreyLc,
      maxedGreyChar,
      maxedGreyLc,
    }: {
      currentGreyChar: T;
      currentGreyLc: T;
      maxedGreyChar: T;
      maxedGreyLc: T;
    },
  ): number {
    switch (key) {
      case "hp":
        return (
          (additionSum + currentGreyChar.hp + currentGreyLc.hp) /
          (maxedGreyChar.hp + maxedGreyLc.hp)
        );
      case "atk":
        return (
          (additionSum + currentGreyChar.atk + currentGreyLc.atk) /
          (maxedGreyChar.atk + maxedGreyLc.atk)
        );
      case "def":
        return (
          (additionSum + currentGreyChar.def + currentGreyLc.def) /
          (maxedGreyChar.def + maxedGreyLc.def)
        );
      case "spd":
        return additionSum;
      case "crit_rate":
      case "crit_dmg":
      case "break_dmg":
      case "heal_rate":
      case "sp_rate":
      case "effect_hit":
      case "effect_res":
      case "all_dmg":
      case "lightning_dmg":
      case "wind_dmg":
      case "fire_dmg":
      case "quantum_dmg":
      case "imaginary_dmg":
      case "ice_dmg":
      case "physical_dmg":
        return additionSum + attributeSum;
    }
  }

  return { data: [] };
}

interface AfterPromotion<T> {
  promotionConfig: T | undefined;
  level?: number;
  ascension?: number;
}

export function charAfterPromotion({
  promotionConfig: bindingPromote,
  level = 80,
  ascension = 6,
}: AfterPromotion<AvatarPromotionSchema[]>) {
  const promotionConfig = bindingPromote?.at(ascension);
  if (!promotionConfig) return { atk: 0, def: 0, hp: 0 };

  const atk_base = promotionConfig.baseAttack;
  const atk_sum = atk_base + (level - 1) * promotionConfig.addAttack;

  const def_base = promotionConfig.baseDefense;
  const def_sum = def_base + (level - 1) * promotionConfig.addDefense;

  const hp_base = promotionConfig.baseHp;
  const hp_sum = hp_base + (level - 1) * promotionConfig.addHp;

  return { atk: atk_sum, def: def_sum, hp: hp_sum };
}

export function lcAfterPromotion({
  promotionConfig,
  level = 80,
  ascension = 6,
}: AfterPromotion<EquipmentPromotionConfig>) {
  if (!promotionConfig)
    return {
      atk: 0,
      def: 0,
      hp: 0,
    };
  const atk_base = promotionConfig.base_attack[ascension]!;
  const atk_sum =
    atk_base + (level - 1) * promotionConfig.base_attack_add[ascension]!;

  const def_base = promotionConfig.base_defence[ascension]!;
  const def_sum =
    def_base + (level - 1) * promotionConfig.base_defence_add[ascension]!;

  const hp_base = promotionConfig.base_hp[ascension]!;
  const hp_sum = hp_base + (level - 1) * promotionConfig.base_hpadd[ascension]!;

  return { atk: atk_sum, def: def_sum, hp: hp_sum };
}

function getNormalizedBound(field: Field, charSpd: number) {
  switch (field) {
    case "hp":
    case "atk":
      return 3;
    case "def":
      return 4;
    case "crit_dmg":
    case "break_dmg":
      return 2.0;
    case "effect_hit":
    case "effect_res":
    case "crit_rate":
    case "heal_rate":
      return 1.0;
    case "sp_rate":
      return 0.5;
    case "spd":
      return 161 - charSpd;
    // element dmg
    default:
      return 1.0;
  }
}

export function getNormalizedBoundProperty(
  property: Property,
  charSpd: number,
) {
  switch (property) {
    case "MaxHP":
    case "Attack":
      return 3;
    case "Defence":
      return 4;
    case "CriticalDamage":
    case "CriticalDamageBase":
    case "BreakDamageAddedRatio":
    case "BreakDamageAddedRatioBase":
      return 2.0;
    case "StatusProbability":
    case "StatusProbabilityBase":
    case "StatusResistance":
    case "StatusResistanceBase":
    case "CriticalChance":
    case "CriticalChanceBase":
    case "HealRatio":
    case "HealRatioBase":
      return 1.0;
    case "SPRatio":
    case "SPRatioBase":
      return 0.5;
    case "Speed":
      return 161 - charSpd;
    // element dmg
    default:
      return 1.0;
  }
}

function filterFieldsByRole<T extends { field: Field }>(
  element: Element,
): (data: T) => boolean {
  const defaultFields: Field[] = [
    "hp",
    "atk",
    "def",
    "crit_dmg",
    "crit_rate",
    "break_dmg",
    "effect_hit",
    "effect_res",
    "heal_rate",
    "sp_rate",
    "spd",
  ];
  let eleField: Field | undefined;
  switch (element) {
    case "Fire":
      eleField = "fire_dmg";
      break;
    case "Ice":
      eleField = "ice_dmg";
      break;
    case "Physical":
      eleField = "physical_dmg";
      break;
    case "Wind":
      eleField = "wind_dmg";
      break;
    case "Lightning":
      eleField = "lightning_dmg";
      break;
    case "Quantum":
      eleField = "quantum_dmg";
      break;
    case "Imaginary":
      eleField = "imaginary_dmg";
      break;
  }
  return (data) => [...defaultFields, eleField].includes(data.field);
}

function filterEmptyValues<T extends { value: number }>() {
  return (data: T) => data.value >= 0.01;
}

function getSortValue(field: Field): number {
  switch (field) {
    case "atk":
      return 0;
    case "spd":
      return 1;
    case "crit_rate":
      return 2;
    case "crit_dmg":
      return 3;
    case "break_dmg":
      return 4;
    case "lightning_dmg":
      return 5;
    case "wind_dmg":
      return 6;
    case "fire_dmg":
      return 7;
    case "quantum_dmg":
      return 8;
    case "imaginary_dmg":
      return 9;
    case "ice_dmg":
      return 10;
    case "physical_dmg":
      return 11;
    case "all_dmg":
      return 12;
    case "sp_rate":
      return 13;
    case "effect_hit":
      return 14;
    case "effect_res":
      return 15;
    case "heal_rate":
      return 16;
    case "def":
      return 17;
    case "hp":
      return 18;
  }
}

function getFieldLabel(field: Field): string {
  switch (field) {
    case "hp":
      return "HP";
    case "atk":
      return "ATK";
    case "def":
      return "DEF";
    case "spd":
      return "Speed";
    case "crit_rate":
      return "Crit Rate";
    case "crit_dmg":
      return "Crit DMG";
    case "break_dmg":
      return "Break Effect";
    case "heal_rate":
      return "Outgoing Healing";
    case "sp_rate":
      return "Energy Regen";
    case "effect_hit":
      return "Effect Hit";
    case "effect_res":
      return "Effect Resist";
    case "lightning_dmg":
      return "Lightning DMG";
    case "wind_dmg":
      return "Wind DMG";
    case "fire_dmg":
      return "Fire DMG";
    case "quantum_dmg":
      return "Quantum DMG";
    case "imaginary_dmg":
      return "Imaginary DMG";
    case "ice_dmg":
      return "Ice DMG";
    case "physical_dmg":
      return "Physical DMG";
    case "all_dmg":
      return "All DMG";
  }
}
