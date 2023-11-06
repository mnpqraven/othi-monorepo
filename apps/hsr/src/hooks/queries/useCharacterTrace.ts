import { SkillTreeConfig } from "@hsr/bindings/SkillTreeConfig";
import { List } from "@hsr/lib/generics";
import API from "@hsr/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

export const optionsCharacterTrace = (id: number) =>
  queryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>({
    queryKey: ["trace", id],
    queryFn: async () => await API.trace.get({ characterId: id }),
    select: (data) => data.list,
  });

export function useCharacterTrace(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsCharacterTrace(characterId!),
    initialData: { list: [] },
    enabled: !!characterId,
    ...opt,
  });
  return query;
}

export function useSuspendedCharacterTrace(
  characterId: number,
  opt: SuspendedOptions = {}
) {
  const query = useQuery({
    ...optionsCharacterTrace(characterId),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>,
  "queryKey" | "queryFn" | "select" | "enabled"
>;
type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
