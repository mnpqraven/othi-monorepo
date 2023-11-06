import API from "@hsr/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export function useLightConeMetadata(lightConeId: number | undefined) {
  const query = useQuery({
    queryKey: ["lightConeMetadata", lightConeId],
    queryFn: async () =>
      await API.lightConeMetadata.get({ lcId: lightConeId! }),
    enabled: !!lightConeId,
  });

  return { lightCone: query.data };
}
