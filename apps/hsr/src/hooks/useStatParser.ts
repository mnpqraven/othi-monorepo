/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import type { Property } from "@hsr/bindings/RelicSubAffixConfig";
import {
  charAfterPromotion,
  lcAfterPromotion,
} from "@hsr/app/card/[uid]/_components/useDataProcess";
import type { RelicType } from "@hsr/bindings/RelicConfig";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "protocol";
import type { AvatarPromotionSchema } from "database/schema";
import { useRelicSetBonuses } from "./queries/useRelicSetBonus";
import { optionLightConePromotion } from "./queries/lightcone";
import { optionsMainStatSpread } from "./queries/useMainStatSpread";

interface BasicMetadata {
  id: number;
  level: number;
  ascension: number;
}
export interface SubStatSchema {
  property: Property;
  value: number;
  step: number;
}
export interface ParsedRelicSchema {
  id?: number;
  rarity: number;
  setId: number;
  // INFO: not yet needed
  type: RelicType;
  level: number;
  property: Property;
  subStats: (SubStatSchema | undefined)[];
}

export interface BaseValueSchema {
  atk: number;
  hp: number;
  def: number;
  speed: number;
  critical_chance: number;
  critical_damage: number;
}

export interface ParsedStatRecord {
  baseValues: BaseValueSchema;
  propertyList: Partial<Record<Property, number>>;
  statTable: Partial<Record<Property, number>>;
  normalized: Pick<BaseValueSchema, "hp" | "atk" | "def">;
}

export interface StatParserConstructor {
  character: BasicMetadata;
  traceTable: Record<string | number, boolean>;
  lightCone: (BasicMetadata & { imposition: number }) | null;
  relic: ParsedRelicSchema[];
}

export function useStatParser(props?: StatParserConstructor) {
  // const { data: traceData } = useQuery(characterTraceQ(props?.character.id));
  const { data: traceData } = trpc.honkai.avatar.trace.by.useQuery(
    { charId: Number(props?.character.id) },
    { enabled: Boolean(props?.character.id) }
  );
  const { data: charPromotionData } = trpc.honkai.avatar.promotions.by.useQuery(
    { charId: Number(props?.character.id) },
    { enabled: Boolean(props?.character.id) }
  );
  const { data: lcPromotionData } = useQuery(
    optionLightConePromotion(props?.lightCone?.id)
  );
  const { data: lcData } = trpc.honkai.lightCone.by.useQuery(
    { lcId: Number(props?.lightCone?.id), withSkill: true },
    { enabled: Boolean(props?.lightCone?.id) }
  );
  const { data: relicBonuses } = useRelicSetBonuses();

  const { data: mainStatLevels } = useSuspenseQuery(optionsMainStatSpread());
  // const mainStatLevels = useAtomValue(mainstatSpreadAtom);

  if (!traceData || !charPromotionData || !props || !relicBonuses) {
    // console.log(
    //   "useStatParser() loading...",
    //   traceData,
    //   charPromotionData,
    //   props,
    //   relicBonuses,
    //   mainStatLevels
    // );
    return undefined;
  }

  const { ascension: charAscension, level: charLevel } = props.character;
  const { ascension: lcAscension, level: lcLevel } = props.lightCone ?? {
    ascension: 0,
    level: 0,
  };

  const baseCharValues = baseChar(charLevel, charAscension, charPromotionData);
  const baseLcValues = baseLc(lcLevel, lcAscension, lcPromotionData);

  const baseValues: BaseValueSchema = {
    atk: baseCharValues.atk + baseLcValues.atk,
    hp: baseCharValues.hp + baseLcValues.hp,
    def: baseCharValues.def + baseLcValues.def,
    speed: charPromotionData.at(0)?.baseSpeed ?? 0,
    critical_chance: charPromotionData.at(0)?.critChance ?? 0.05,
    critical_damage: charPromotionData.at(0)?.critDamage ?? 0.5,
  };

  // INFO: PERCENT FROM LC
  const lcTotal: Partial<Record<Property, number>> = {};
  const lcProps = lcData?.skill?.abilityProperty?.at(
    props.lightCone?.imposition ?? 0
  );
  if (lcProps) {
    lcProps.forEach(({ propertyType, value }) => {
      if (!lcTotal[propertyType]) lcTotal[propertyType] = value;
      else lcTotal[propertyType] += value;
    });
  }
  // INFO: PERCENT FROM TRACES
  const tracePropList = traceData
    .filter((trace) =>
      Object.keys(props.traceTable).includes(String(trace.pointId))
    )
    .filter((trace) => Boolean(trace.statusAddList?.length))
    .map((trace) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      property: trace.statusAddList?.at(0)?.propertyType!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: trace.statusAddList?.at(0)?.value!,
    }));

  const traceTotal: Partial<Record<Property, number>> = {};

  tracePropList.forEach(({ property, value }) => {
    if (!traceTotal[property]) traceTotal[property] = value;
    else traceTotal[property]! += value;
  });

  // INFO: PERCENT FROM RELIC SET BONUSES
  // Record<setId, num>
  const setTracker: Record<string, number> = {};
  props.relic.forEach(({ setId }) => {
    if (!setTracker[setId]) setTracker[setId] = 1;
    else setTracker[setId] += 1;
  });
  // Record<Property, number>
  const setBonusTotal: Partial<Record<Property, number>> = {};
  Object.entries(setTracker).forEach(([setId, possessingCount]) => {
    const find = relicBonuses.find((e) => e.set_id === Number(setId));
    if (!find) return;

    find.property_list.forEach((props, index) => {
      // not reaching pc req. for bonus activation
      if (find.require_num[index]! > possessingCount) return;
      props.forEach(({ property, value }) => {
        if (!setBonusTotal[property]) setBonusTotal[property] = value;
        else setBonusTotal[property]! += value;
      });
    });
  });

  // INFO: PERCENT FROM RELIC
  // this ignore substat step so we can map it out
  const subStatNoStep = (relic: ParsedRelicSchema) =>
    relic.subStats
      .filter(Boolean)
      .map(({ property, value }: SubStatSchema) => ({ property, value }));

  const relicPropList: {
    property: Property;
    value: number;
  }[][] = props.relic.map((relic) => {
    const find = mainStatLevels[relic.type].find(
      (e) => e.property === relic.property
    );
    if (!find) return [...subStatNoStep(relic)];
    const value = find.base_value + find.level_add * relic.level;
    const main = { property: relic.property, value };
    return [
      { property: main.property, value: main.value },
      ...subStatNoStep(relic),
    ];
  });

  const relicTotal: Partial<Record<Property, number>> = {};

  relicPropList.forEach((props) => {
    props.forEach(({ property, value }) => {
      if (!relicTotal[property]) relicTotal[property] = value;
      else relicTotal[property]! += value;
    });
  });

  // WARN: lcTotal returns undefined
  const summed = sumProps([traceTotal, relicTotal, setBonusTotal, lcTotal]);

  // TODO: parse relic data then multiply base with trace altogether

  const {
    atk: maxChAtk,
    def: maxChDef,
    hp: maxChHp,
  } = charAfterPromotion({
    promotionConfig: charPromotionData,
  });

  const {
    atk: maxLcAtk,
    def: maxLcDef,
    hp: maxLcHp,
  } = lcAfterPromotion({ promotionConfig: lcPromotionData });
  const normalized = {
    atk:
      (baseValues.atk +
        orZero(summed.AttackDelta) +
        baseValues.atk * orZero(summed.AttackAddedRatio)) /
      (maxChAtk + maxLcAtk),
    def:
      (baseValues.def +
        orZero(summed.DefenceDelta) +
        baseValues.def * orZero(summed.DefenceAddedRatio)) /
      (maxChDef + maxLcDef),
    hp:
      (baseValues.hp +
        orZero(summed.HPDelta) +
        baseValues.hp * orZero(summed.HPAddedRatio)) /
      (maxChHp + maxLcHp),
  };

  const result = {
    baseValues,
    propertyList: summed,
    statTable: toStatTable(baseValues, summed),
    normalized,
  };

  return result;
}

function baseChar(
  level: number,
  ascension: number,
  promoteData: AvatarPromotionSchema[]
) {
  const bindingPromote = promoteData.at(ascension)!;
  const { addAttack, baseAttack, addHp, baseHp, addDefense, baseDefense } =
    bindingPromote;
  return {
    atk: baseAttack + (level - 1) * addAttack,
    hp: baseHp + (level - 1) * addHp,
    def: baseDefense + (level - 1) * addDefense,
  };
}
function baseLc(
  level: number,
  ascension: number,
  promoteData: EquipmentPromotionConfig | undefined
) {
  if (promoteData) {
    const {
      base_attack,
      base_attack_add,
      base_defence,
      base_defence_add,
      base_hp,
      base_hpadd,
    } = promoteData;
    return {
      atk: base_attack[ascension]! + (level - 1) * base_attack_add[ascension]!,
      hp: base_hp[ascension]! + (level - 1) * base_hpadd[ascension]!,
      def:
        base_defence[ascension]! + (level - 1) * base_defence_add[ascension]!,
    };
  }
  return { atk: 0, hp: 0, def: 0 };
}

function sumProps(
  props: Partial<Record<Property, number>>[]
): Partial<Record<Property, number>> {
  const ret: Partial<Record<Property, number>> = {};
  props.forEach((prop) => {
    Object.entries(prop).forEach(([p, value]) => {
      const property = p as Property;
      if (!ret[property]) ret[property] = value;
      else ret[property]! += value;
    });
  });
  return ret;
}

const ELE_KEYS: Property[] = [
  "FireAddedRatio",
  "IceAddedRatio",
  "PhysicalAddedRatio",
  "WindAddedRatio",
  "ThunderAddedRatio",
  "QuantumAddedRatio",
  "ImaginaryAddedRatio",
];

const CUSTOM_KEYS: Property[] = [
  "AttackAddedRatio",
  "AttackDelta",
  "HPAddedRatio",
  "HPDelta",
  "DefenceAddedRatio",
  "DefenceDelta",
  "SpeedDelta",
  "CriticalChanceBase",
  "CriticalDamageBase",
  // specific ele += all damagetype
  "AllDamageTypeAddedRatio",
  ...ELE_KEYS,
];

function toStatTable(
  baseValue: BaseValueSchema,
  map: Partial<Record<Property, number>>
) {
  const { atk, critical_chance, critical_damage, def, hp, speed } = baseValue;
  // automated keys inside map
  // will be spreaded for autofill
  const automatedKeys: Partial<Record<Property, number>> = Object.fromEntries(
    Object.entries(map).filter(
      ([key, _value]) => !CUSTOM_KEYS.includes(key as Property)
    )
  );
  const eleKeys: Partial<Record<Property, number>> = Object.fromEntries(
    ELE_KEYS.map((key) => [
      key,
      orZero(map[key]) + orZero(map.AllDamageTypeAddedRatio),
    ])
  );

  // leave the trinity to generic keys
  const ret: Partial<Record<Property, number>> = {
    Defence:
      (orZero(map.DefenceAddedRatio, 1) + 1) * def + orZero(map.DefenceDelta),
    MaxHP: (orZero(map.HPAddedRatio, 1) + 1) * hp + orZero(map.HPDelta),
    Attack:
      (orZero(map.AttackAddedRatio, 1) + 1) * atk + orZero(map.AttackDelta),
    Speed: speed + orZero(map.SpeedDelta),
    CriticalChanceBase: critical_chance + orZero(map.CriticalChanceBase),
    CriticalDamageBase: critical_damage + orZero(map.CriticalDamageBase),
    ...eleKeys,
    ...automatedKeys,
  };
  return ret;
}

function orZero(n: number | null | undefined, def?: number): number {
  if (!n) return def ? def : 0;
  return n;
}
