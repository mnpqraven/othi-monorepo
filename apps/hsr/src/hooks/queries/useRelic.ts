import type { RelicConfig } from "@hsr/bindings/RelicConfig";
import API from "@hsr/server/typedEndpoints";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { List } from "lib/generics";

export const optionsRelic = (setIds: number[] | undefined) =>
  queryOptions<List<RelicConfig>, unknown, RelicConfig[]>({
    queryKey: ["relics", setIds],
    queryFn: () =>
      setIds ? API.relics.post({ list: setIds }) : Promise.reject(new Error()),
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
    enabled: Boolean(setIds),
  });

export function useRelics(setIds: number[] | undefined, opt: Options = {}) {
  const query = useQuery({
    ...optionsRelic(setIds),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicConfig>, unknown, RelicConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
