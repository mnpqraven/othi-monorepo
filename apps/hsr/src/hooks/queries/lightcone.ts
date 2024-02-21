import type { EquipmentPromotionConfig } from "@hsr/bindings/EquipmentPromotionConfig";
import API from "@hsr/server/typedEndpoints";
import { queryOptions } from "@tanstack/react-query";

export const optionLightConePromotion = (lcId: number | undefined) =>
  queryOptions<EquipmentPromotionConfig>({
    queryKey: ["lightConePromotion", lcId],
    queryFn: () =>
      lcId ? API.lightConePromotion.get({ lcId }) : Promise.reject(new Error()),
    enabled: Boolean(lcId),
  });
