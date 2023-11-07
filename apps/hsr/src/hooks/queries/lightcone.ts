import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import type { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import type { EquipmentSkillConfig } from "@hsr/bindings/EquipmentSkillConfig";
import API from "@hsr/server/typedEndpoints";
import { queryOptions } from "@tanstack/react-query";
import type { List } from "lib/generics";

export const lightConesQ = () =>
  queryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>({
    queryKey: ["lightConeMetadata"],
    queryFn: () => API.lightConeMetadataMany.get(),
    select: (data) =>
      data.list.sort(
        (a, b) =>
          b.rarity - a.rarity ||
          a.equipment_name.localeCompare(b.equipment_name)
      ),
    initialData: { list: [] },
  });

export const lightConeMetadataQ = (lcId: number | undefined) =>
  queryOptions<EquipmentConfig>({
    queryKey: ["lightConeMetadata", lcId],
    queryFn: () =>
      lcId ? API.lightConeMetadata.get({ lcId }) : Promise.reject(),
    enabled: Boolean(lcId),
  });

export const lightConeMetadatasQ = (lightConeIds: number[] | undefined) =>
  queryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>({
    queryKey: ["lightConeMetadatas", lightConeIds],
    queryFn: () =>
      lightConeIds
        ? API.lightConeMetadataMany.post({ list: lightConeIds })
        : Promise.reject(),
    select: (data) => data.list,
    enabled: Boolean(lightConeIds),
  });

export const optionLightConePromotion = (lcId: number | undefined) =>
  queryOptions<EquipmentPromotionConfig>({
    queryKey: ["lightConePromotion", lcId],
    queryFn: () =>
      lcId ? API.lightConePromotion.get({ lcId }) : Promise.reject(),
    enabled: Boolean(lcId),
  });

export const optionLightConeSkill = (lcId: number | undefined) =>
  queryOptions<EquipmentSkillConfig>({
    queryKey: ["lightConeSkill", lcId],
    queryFn: () => (lcId ? API.lightConeSkill.get({ lcId }) : Promise.reject()),
    enabled: Boolean(lcId),
  });

export const optionsLightConeSkills = (lcIds: number[] | undefined) =>
  queryOptions<List<EquipmentSkillConfig>, unknown, EquipmentSkillConfig[]>({
    queryKey: ["lightConeSkills", lcIds],
    queryFn: () =>
      lcIds ? API.lightConeSkillMany.post({ list: lcIds }) : Promise.reject(),
    select: (data) => data.list,
    enabled: Boolean(lcIds),
  });
