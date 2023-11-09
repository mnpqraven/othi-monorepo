import type { RelicType } from "@hsr/bindings/RelicConfig";
import API from "@hsr/server/typedEndpoints";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const optionsRelicSlotType = (setIds: number[] | undefined) =>
  queryOptions<Record<number, RelicType>, unknown, Record<number, RelicType>>({
    queryKey: ["relic_slot_type", setIds],
    queryFn: () => API.relicSlotType.post({ list: setIds ?? [] }),
  });

export function useRelicSlotType(
  setIds: number[] | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsRelicSlotType(setIds),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<
    Record<number, RelicType>,
    unknown,
    Record<number, RelicType>
  >,
  "queryKey" | "queryFn"
>;
