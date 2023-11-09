import type { PatchBanner } from "@hsr/app/api/patch_banners/route";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { List } from "lib/generics";

type Options = Omit<
  UseQueryOptions<List<PatchBanner>, unknown, PatchBanner[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
export function useBannerList(opt: Options = {}) {
  const query = useQuery({
    queryKey: ["bannerList"],
    queryFn: async () => {
      const res = await fetch("/api/patch_banners");
      if (res.ok) {
        return res.json() as Promise<List<PatchBanner>>;
      }
      // eslint-disable-next-line no-console
      console.error("api fetch failed, code:", res.status);
      return Promise.reject(Error(`unknown error ${await res.text()}`));
    },
    select: (data) => data.list,
    initialData: { list: [] },
    ...opt,
  });

  return { bannerList: query.data };
}
