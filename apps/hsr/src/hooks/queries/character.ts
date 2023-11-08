import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import type { AvatarPromotionConfig } from "@hsr/bindings/AvatarPromotionConfig";
import type { AvatarRankConfig } from "@hsr/bindings/AvatarRankConfig";
import type { AvatarSkillConfig } from "@hsr/bindings/AvatarSkillConfig";
import type { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import API from "@hsr/server/typedEndpoints";
import { queryOptions } from "@tanstack/react-query";
import type { List } from "lib/generics";

export const characterEidolonsQ = (characterId: number | undefined) =>
  queryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>({
    queryKey: ["eidolon", characterId],
    queryFn: () =>
      characterId ? API.eidolon.get({ characterId }) : Promise.reject(),
    select: ({ list }) => list,
    enabled: Boolean(characterId),
  });

export const characterMetadatasQ = () =>
  queryOptions<List<AvatarConfig>, unknown, AvatarConfig[]>({
    queryKey: ["character"],
    queryFn: () => API.characterByIds.get(),
    initialData: { list: [] },
    select: (data) =>
      data.list.sort(
        (a, b) =>
          b.rarity - a.rarity ||
          a.avatar_name.localeCompare(b.avatar_name) ||
          a.avatar_votag.localeCompare(b.avatar_votag)
      ),
  });

export const characterMetadataQ = (characterId: number | undefined) =>
  queryOptions<AvatarConfig>({
    queryKey: ["character", characterId],
    queryFn: () =>
      characterId ? API.character.get({ characterId }) : Promise.reject(),
    enabled: Boolean(characterId),
  });

export const characterPromotionQ = (charId: number | undefined) =>
  queryOptions<AvatarPromotionConfig>({
    queryKey: ["promotion", charId],
    queryFn: () =>
      charId ? API.promotion.get({ characterId: charId }) : Promise.reject(),
    enabled: Boolean(charId),
  });

export const characterSkillQ = (characterId: number | undefined) =>
  queryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>({
    queryKey: ["skill", characterId],
    queryFn: () =>
      characterId ? API.skillsByCharId.get({ characterId }) : Promise.reject(),
    select: (data) => data.list,
    initialData: { list: [] },
    enabled: Boolean(characterId),
  });

export const characterTraceQ = (characterId: number | undefined) =>
  queryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>({
    queryKey: ["trace", characterId],
    queryFn: () =>
      characterId ? API.trace.get({ characterId }) : Promise.reject(),
    select: (data) => data.list,
  });
