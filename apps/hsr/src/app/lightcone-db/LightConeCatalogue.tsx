"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { IMAGE_URL } from "@hsr/lib/constants";
import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lightConesQ } from "@hsr/hooks/queries/lightcone";
import useLightConeFilter from "../components/Db/useLightConeFilter";
import { DbFilter } from "../components/Db/DbFilter";
import { LightConeCard } from "./LightConeCard";

function search(data: EquipmentConfig[], query: string | undefined) {
  const fz = new Fuse(data, {
    keys: [
      "equipment_name",
      "equipment_id",
    ] satisfies (keyof EquipmentConfig)[],
    threshold: 0.4,
  });

  if (query?.length) return fz.search(query).map((e) => e.item);
  return data;
}

function LightConeCatalogue() {
  const router = useRouter();
  const { filter, query, updateQuery } = useLightConeFilter();
  const { data } = useSuspenseQuery(lightConesQ());

  const processedData = search(data, query)
    .filter(filter.byRarity)
    .filter(filter.byPath);

  function onEnter(_query: string) {
    if (processedData.length > 0)
      router.push(`/lightcone-db/${processedData.at(0)?.equipment_id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        onEnterKey={onEnter}
        updateText={updateQuery}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((lc) => (
          <div
            className="flex flex-col items-center gap-3 self-start"
            id="lc-card"
            key={lc.equipment_id}
          >
            <Link href={`/lightcone-db/${lc.equipment_id}`}>
              <LightConeCard
                imgUrl={url(lc.equipment_id)}
                name={lc.equipment_name}
                path={lc.avatar_base_type}
                rarity={lc.rarity}
              />
            </Link>

            <p className="text-center font-semibold">{lc.equipment_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default LightConeCatalogue;

function url(id: string | number): string {
  return `${IMAGE_URL}image/light_cone_preview/${id}.png`;
}
