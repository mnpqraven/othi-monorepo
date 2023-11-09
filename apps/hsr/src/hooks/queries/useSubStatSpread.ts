import type { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import API from "@hsr/server/typedEndpoints";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { List } from "lib/generics";

export const optionsSubStatSpread = () =>
  queryOptions<List<RelicSubAffixConfig>, unknown, RelicSubAffixConfig[]>({
    queryKey: ["statspread_sub"],
    queryFn: API.substatSpread.get,
    select: (data) => data.list,
  });

export function useSubStatSpread(opt: Options = {}) {
  const query = useQuery({
    ...optionsSubStatSpread(),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicSubAffixConfig>, unknown, RelicSubAffixConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
