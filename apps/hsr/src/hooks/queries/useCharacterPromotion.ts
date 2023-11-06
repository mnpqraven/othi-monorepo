import type { AvatarPromotionConfig } from "@hsr/bindings/AvatarPromotionConfig";
import API from "@hsr/server/typedEndpoints";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<AvatarPromotionConfig>,
  "enabled" | "queryKey" | "queryFn"
>;
export const optionCharacterPromotion = (charId: number | undefined) =>
  queryOptions<AvatarPromotionConfig>({
    queryKey: ["promotion", charId],
    queryFn: () => API.promotion.get({ characterId: charId! }),
    enabled: Boolean(charId),
  });

export function useCharacterPromotion(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionCharacterPromotion(characterId),
    ...opt,
  });
  return query;
}
