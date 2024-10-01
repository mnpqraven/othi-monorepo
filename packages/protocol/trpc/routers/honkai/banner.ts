import { createClient } from "@vercel/edge-config";
import { publicProcedure, router } from "../../trpc";
import { env } from "env";

export const bannerRouter = router({
  patchList: publicProcedure.query(async () => {
    const config = createClient(env.EDGE_CONFIG);
    const res = await config.get<PatchBanner[]>("patch_banners");
    return res ?? [];
  }),
});

interface Item {
  id?: number;
  placeholder?: string;
  href?: string;
}

export interface PatchBanner {
  phase: 1 | 2;
  version: `${number}.${number}.${1 | 2}`;
  chara: [Item | null, Item | null, Item | null, Item | null];
  lc: [Item | null, Item | null, Item | null, Item | null];
}
