import type { AvatarSkillConfig } from "@hsr/bindings/AvatarSkillConfig";
import API from "@hsr/server/typedEndpoints";
import type {
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { List } from "lib/generics";

export const optionCharacterSkill = (charId: number | undefined) =>
  queryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>({
    queryKey: ["skill", charId],
    queryFn: () => API.skillsByCharId.get({ characterId: charId! }),
    select: (data) => data.list,
    initialData: { list: [] },
    enabled: Boolean(charId),
  });

export const suspendedOptionCharacterSkill = (charId: number | undefined) =>
  queryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>({
    queryKey: ["skill", charId],
    queryFn: () => API.skillsByCharId.get({ characterId: charId! }),
    select: (data) => data.list,
  });

export function useCharacterSkill(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionCharacterSkill(characterId),
    ...opt,
  });

  return query;
}

export function useSuspendedCharacterSkill(
  characterId: number | undefined,
  opt: SuspendedOptions = {}
) {
  const query = useSuspenseQuery({
    ...suspendedOptionCharacterSkill(characterId),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>,
  "enabled" | "queryKey" | "queryFn" | "select" | "initialData"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    List<AvatarSkillConfig>,
    unknown,
    AvatarSkillConfig[]
  >,
  "enabled" | "queryKey" | "queryFn" | "select" | "initialData"
>;
