import type { RelicType } from "@hsr/bindings/RelicConfig";
import type { RelicMainAffixConfig } from "@hsr/bindings/RelicMainAffixConfig";
import API from "@hsr/server/typedEndpoints";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const optionsMainStatSpread = () =>
  queryOptions<
    Record<RelicType, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicType, RelicMainAffixConfig[]>
  >({
    queryKey: ["statspread_main"],
    queryFn: API.mainstatSpread.get,
  });

export function useMainStatSpread(opt: Options = {}) {
  const query = useQuery({
    ...optionsMainStatSpread(),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<
    Record<RelicType, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicType, RelicMainAffixConfig[]>
  >,
  "queryKey" | "queryFn"
>;
