import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { List } from "@hsr/lib/generics";

export async function GET() {
  const patch_banners = await get<PatchBanner[]>("patch_banners");
  if (patch_banners)
    return NextResponse.json<List<PatchBanner>>({ list: patch_banners });
  return new NextResponse("getting edge config data failed", {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

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
