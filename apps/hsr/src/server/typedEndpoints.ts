import type { SignatureAtlas } from "@hsr/bindings/SignatureAtlas";
import type { List } from "@hsr/lib/generics";
import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import type { AvatarSkillConfig } from "@hsr/bindings/AvatarSkillConfig";
import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import type { EquipmentSkillConfig } from "@hsr/bindings/EquipmentSkillConfig";
import type { EquipmentRanking } from "@hsr/bindings/EquipmentRanking";
import type { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import type { AvatarRankConfig } from "@hsr/bindings/AvatarRankConfig";
import type { Patch } from "@hsr/bindings/Patch";
import type { PatchBanner } from "@hsr/bindings/PatchBanner";
import type { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import type { AvatarPromotionConfig } from "@hsr/bindings/AvatarPromotionConfig";
import type { Banner } from "@hsr/bindings/Banner";
import type { RelicSetConfig } from "@hsr/bindings/RelicSetConfig";
import type { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import type { RelicMainAffixConfig } from "@hsr/bindings/RelicMainAffixConfig";
import type { RelicSetSkillConfig } from "@hsr/bindings/RelicSetSkillConfig";
import type { RelicConfig, RelicType } from "@hsr/bindings/RelicConfig";
import { z } from "zod";
import { serverFetch } from "./serverFetch";

const CharId = z.object({
  characterId: z.number(),
});
type CharId = z.TypeOf<typeof CharId>;

interface LcId {
  lcId: number;
}
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
    (data) => `/honkai/avatar/${CharId.parse(data).characterId}`
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

interface Get<TRes, P> {
  get: (params: P) => Promise<TRes>;
}
interface DirectGet<TRes> {
  get: () => Promise<TRes>;
}
interface Post<TRes, TPayload, P> {
  post: (params: P, payload?: TPayload) => Promise<TRes>;
}
interface DirectPost<TRes, TPayload> {
  post: (payload?: TPayload) => Promise<TRes>;
}

// type ReturnDev<TRes, U> = { get: (params: U) => Promise<TRes> };
// type OptionalReturnDev<TRes> = { get: () => Promise<TRes> };

function get<TRes>(path: string): DirectGet<TRes>;
function get<TRes, TParam>(path: (t: TParam) => string): Get<TRes, TParam>;
function get<TRes, TParam>(
  path: string | ((params: TParam) => string)
): DirectGet<TRes> | Get<TRes, TParam> {
  if (typeof path === "string")
    return {
      get: async () => serverFetch<unknown, TRes>(path),
    };

  return {
    get: async (params: TParam) => serverFetch<unknown, TRes>(path(params)),
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
        serverFetch<TPayload, TRes>(path, { method: "POST", payload }),
    };

  return {
    post: async (params: TParam, payload?: TPayload) =>
      serverFetch<TPayload, TRes>(path(params), {
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
      get: async () => serverFetch<unknown, TRes>(path),
      post: async (payload?: TPayload) =>
        serverFetch<TPayload, TRes>(path, {
          method: "POST",
          payload,
        }),
    };
  }
  return {
    get: async (params: TParam) => serverFetch<unknown, TRes>(path(params)),
    post: async (params: TParam, payload?: TPayload) =>
      serverFetch<TPayload, TRes>(path(params), {
        method: "POST",
        payload,
      }),
  };
}

export default API;
