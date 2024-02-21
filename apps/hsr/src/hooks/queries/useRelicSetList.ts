import type { RelicSetConfig } from "@hsr/bindings/RelicSetConfig";
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

export const optionsRelicSet = () =>
  queryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>({
    queryKey: ["relic_sets"],
    queryFn: API.relicSets.get,
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
  });

export function useRelicSets(opt: Options = {}) {
  const query = useQuery({
    ...optionsRelicSet(),
    ...opt,
  });

  return query;
}

export function useSuspendedRelicSets(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsRelicSet(),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

export const optionRelicSet = (setId: number | undefined) =>
  queryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>({
    queryKey: ["relic_set", setId],
    queryFn: () =>
      setId
        ? API.relicSet.get({ relicSetId: setId })
        : Promise.reject(new Error()),
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
    enabled: Boolean(setId),
  });

export function useRelicSet(setId: number | undefined, opt: Option = {}) {
  const query = useQuery({
    ...optionRelicSet(setId),
    ...opt,
  });

  return query;
}
type Option = Omit<
  UseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
