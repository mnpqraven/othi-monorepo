"use client";

import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { Content } from "@hsr/app/lightcone-db/[slug]/Content";
import { Portrait } from "@hsr/app/lightcone-db/[slug]/Portrait";
import {
  lightConeMetadatasQ,
  optionsLightConeSkills,
} from "@hsr/hooks/queries/lightcone";
import { IMAGE_URL } from "@hsr/lib/constants";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { byCharId } from "protocol/ts/atlas-SignatureAtlasService_connectquery";
import { useState } from "react";

interface Prop {
  characterId: number;
}

function SignatureLightCone({ characterId }: Prop) {
  const { data } = useSuspenseQuery(byCharId.useQuery({ charId: characterId }));
  const { lcIds } = data;

  const [selectedLcId, setSelectedLcId] = useState(lcIds.at(0));

  const { data: lcMetadatas } = useSuspenseQuery(lightConeMetadatasQ(lcIds));
  const { data: lcSkills } = useQuery(optionsLightConeSkills(lcIds));

  const metadata = lcMetadatas.find((e) => e.equipment_id === selectedLcId);
  const skill = lcSkills?.find((e) => e.skill_id === metadata?.skill_id);

  if (!metadata) return null;

  const sortedLcs = lcMetadatas.sort((a, b) => b.rarity - a.rarity);

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col p-6">
          <Portrait data={metadata} />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="grid grid-cols-4">
            {sortedLcs.map((lc) => (
              <button
                className="relative p-2 cursor-default"
                key={lc.equipment_id}
                onClick={() => {
                  setSelectedLcId(lc.equipment_id);
                }}
                type="button"
              >
                <LightConeCard
                  imgUrl={url(lc.equipment_id)}
                  name={lc.equipment_name}
                />
              </button>
            ))}
          </div>

          <Content data={metadata} link skill={skill} />
        </div>
      </div>
    </div>
  );
}

export { SignatureLightCone };

function url(id: string | number): string {
  return `${IMAGE_URL}image/light_cone_preview/${id}.png`;
}
