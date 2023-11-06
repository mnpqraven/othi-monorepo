import { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import { List } from "@hsr/lib/generics";
import API from "@hsr/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsSubStatSpread = () =>
  queryOptions<List<RelicSubAffixConfig>, unknown, RelicSubAffixConfig[]>({
    queryKey: ["statspread_sub"],
    queryFn: async () => await API.substatSpread.get(),
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
