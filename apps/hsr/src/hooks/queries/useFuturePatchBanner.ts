import type { PatchBanner } from "@hsr/bindings/PatchBanner";
import API from "@hsr/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import type { List } from "lib/generics";

export const useFuturePatchBannerList = () => {
  const { data: futurePatchBannerList } = useQuery({
    queryKey: ["futurePatchBannerList"],
    queryFn: () => API.patchBanners.get(),
    initialData: { list: [] },
  });

  return { futurePatchBannerList };
};

const _BASE = new Date("2023-07-19T02:00:00Z");
export const useFuturePatchBannerList2 = () => {
  const futurePatchBannerList: List<PatchBanner> = { list: [] };

  return { futurePatchBannerList };
};
