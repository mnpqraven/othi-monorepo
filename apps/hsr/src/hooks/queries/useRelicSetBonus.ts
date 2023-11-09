import type { RelicSetSkillConfig } from "@hsr/bindings/RelicSetSkillConfig";
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

export const optionsRelicSetBonuses = () =>
  queryOptions<List<RelicSetSkillConfig>, unknown, RelicSetSkillConfig[]>({
    queryKey: ["relic_bonus"],
    queryFn: API.relicSetBonuses.get,
    select: (data) => data.list,
  });

export function useRelicSetBonuses(opt: Options = {}) {
  const query = useQuery({
    ...optionsRelicSetBonuses(),
    ...opt,
  });

  return query;
}

export function useSuspendedRelicSets(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsRelicSetBonuses(),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicSetSkillConfig>, unknown, RelicSetSkillConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    List<RelicSetSkillConfig>,
    unknown,
    RelicSetSkillConfig[]
  >,
  "queryKey" | "queryFn" | "select"
>;
