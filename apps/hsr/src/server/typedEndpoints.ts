import { serverFetch } from "./serverFetch";
import { SignatureAtlas } from "@hsr/bindings/SignatureAtlas";
import { List } from "@hsr/lib/generics";
import { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { AvatarSkillConfig } from "@hsr/bindings/AvatarSkillConfig";
import { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { EquipmentSkillConfig } from "@hsr/bindings/EquipmentSkillConfig";
import { EquipmentRanking } from "@hsr/bindings/EquipmentRanking";
import { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import { AvatarRankConfig } from "@hsr/bindings/AvatarRankConfig";
import { Patch } from "@hsr/bindings/Patch";
import { PatchBanner } from "@hsr/bindings/PatchBanner";
import { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import { AvatarPromotionConfig } from "@hsr/bindings/AvatarPromotionConfig";
import { Banner } from "@hsr/bindings/Banner";
import { RelicSetConfig } from "@hsr/bindings/RelicSetConfig";
import { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import { RelicMainAffixConfig } from "@hsr/bindings/RelicMainAffixConfig";
import { RelicSetSkillConfig } from "@hsr/bindings/RelicSetSkillConfig";
import { RelicConfig, RelicType } from "@hsr/bindings/RelicConfig";

type CharId = { characterId: number };
type LcId = { lcId: number };
const API = {
  patchDates: get<List<Patch>>("/honkai/patch_dates"),
  lightConeMetadata: get<EquipmentConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/metadata`
  ),
  patchBanners: get<List<PatchBanner>>("/honkai/patch_banners"),
  lightConeMetadataMany: getPost<List<EquipmentConfig>, List<number>>(
    "/honkai/light_cone/metadata"
  ),
  lightConeSkill: get<EquipmentSkillConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/skill`
  ),
  lightConeSkillMany: getPost<List<EquipmentSkillConfig>, List<number>>(
    "/honkai/light_cone/skill"
  ),
  lightConeRanking: get<List<EquipmentRanking>>("/honkai/light_cone/ranking"),
  lightConePromotion: get<EquipmentPromotionConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/promotion`
  ),
  character: get<AvatarConfig, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}`
  ),
  characterByIds: getPost<List<AvatarConfig>, List<number>>("/honkai/avatar"),
  signatureAtlas: get<List<SignatureAtlas>>("/honkai/signature_atlas"),
  skillsByCharId: get<List<AvatarSkillConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/skill`
  ),
  trace: get<List<SkillTreeConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/trace`
  ),
  properties: get<List<AvatarPropertyConfig>>("/honkai/properties"),
  eidolon: get<List<AvatarRankConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/eidolon`
  ),
  promotion: get<AvatarPromotionConfig, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/promotion`
  ),
  warpBanner: get<List<Banner>>("/honkai/warp_banners"),
  relicSlotType: post<Record<number, RelicType>, List<number>>(
    "/honkai/relics/slot_type"
  ),
  relics: post<List<RelicConfig>, List<number>>("/honkai/relics"),
  relicSets: get<List<RelicSetConfig>>("/honkai/relic_set"),
  relicSet: get<List<RelicSetConfig>, { relicSetId: number }>(
    ({ relicSetId }) => `/honkai/relic_set/${relicSetId}`
  ),
  relicSetBonuses: get<List<RelicSetSkillConfig>>("/honkai/relic_set/bonus"),
  relicSetBonus: get<RelicSetSkillConfig, { relicSetId: number }>(
    ({ relicSetId }) => `/honkai/relic_set/bonus/${relicSetId}`
  ),
  substatSpread: get<List<RelicSubAffixConfig>>(
    "/honkai/relics/statspread/sub"
  ),
  mainstatSpread: get<Record<RelicType, RelicMainAffixConfig[]>>(
    "/honkai/relics/statspread/main"
  ),
};

type Get<TRes, P> = { get: (params: P) => Promise<TRes> };
type DirectGet<TRes> = { get: () => Promise<TRes> };
type Post<TRes, TPayload, P> = {
  post: (params: P, payload?: TPayload) => Promise<TRes>;
};
type DirectPost<TRes, TPayload> = {
  post: (payload?: TPayload) => Promise<TRes>;
};

// type ReturnDev<TRes, U> = { get: (params: U) => Promise<TRes> };
// type OptionalReturnDev<TRes> = { get: () => Promise<TRes> };

function get<TRes>(path: string): DirectGet<TRes>;
function get<TRes, TParam>(path: (t: TParam) => string): Get<TRes, TParam>;
function get<TRes, TParam>(
  path: string | ((params: TParam) => string)
): DirectGet<TRes> | Get<TRes, TParam> {
  if (typeof path === "string")
    return {
      get: async () => await serverFetch<unknown, TRes>(path),
    };

  return {
    get: async (params: TParam) =>
      await serverFetch<unknown, TRes>(path(params)),
  };
}

function post<TRes, TPayload>(path: string): DirectPost<TRes, TPayload>;
function post<TRes, TPayload, TParam>(
  path: (t: TParam) => string
): Post<TRes, TPayload, TParam>;
function post<TRes, TPayload, TParam>(
  path: string | ((t: TParam) => string)
): DirectPost<TRes, TPayload> | Post<TRes, TPayload, TParam> {
  if (typeof path === "string")
    return {
      post: async (payload?: TPayload) =>
        await serverFetch<TPayload, TRes>(path, { method: "POST", payload }),
    };

  return {
    post: async (params: TParam, payload?: TPayload) =>
      await serverFetch<TPayload, TRes>(path(params), {
        method: "POST",
        payload,
      }),
  };
}

function getPost<TRes, TPayload>(
  path: string
): DirectGet<TRes> & DirectPost<TRes, TPayload>;

function getPost<TRes, TPayload, TParam>(
  path: (t: TParam) => string
): Get<TRes, TParam> & Post<TRes, TPayload, TParam>;

function getPost<TRes, TPayload, TParam>(
  path: string | ((t: TParam) => string)
):
  | (DirectGet<TRes> & DirectPost<TRes, TPayload>)
  | (Get<TRes, TParam> & Post<TRes, TPayload, TParam>) {
  if (typeof path === "string") {
    return {
      get: async () => await serverFetch<unknown, TRes>(path),
      post: async (payload?: TPayload) =>
        await serverFetch<TPayload, TRes>(path, {
          method: "POST",
          payload,
        }),
    };
  } else {
    return {
      get: async (params: TParam) =>
        await serverFetch<unknown, TRes>(path(params)),
      post: async (params: TParam, payload?: TPayload) =>
        await serverFetch<TPayload, TRes>(path(params), {
          method: "POST",
          payload,
        }),
    };
  }
}

export default API;
