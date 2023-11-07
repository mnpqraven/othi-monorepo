"use client";

import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { Content } from "@hsr/app/lightcone-db/[slug]/Content";
import { Portrait } from "@hsr/app/lightcone-db/[slug]/Portrait";
import { useSuspendedLightConeMetadatas } from "@hsr/hooks/queries/useLightConeMetadatas";
import { useSuspendedLightConeSkills } from "@hsr/hooks/queries/useLightConeSkills";
import { useSuspendedFeaturedLc } from "@hsr/hooks/queries/useSignatureAtlas";
import { IMAGE_URL } from "@hsr/lib/constants";
import { useState } from "react";

interface Prop {
  characterId: number;
}

function SignatureLightCone({ characterId }: Prop) {
  const { data } = useSuspendedFeaturedLc(characterId);
  const { lcIds } = data;

  const [selectedLcId, setSelectedLcId] = useState(lcIds.at(0));

  const { data: lcSkills } = useSuspendedLightConeSkills(lcIds);
  const { data: lcMetadatas } = useSuspendedLightConeMetadatas(lcIds);

  const metadata = lcMetadatas.find((e) => e.equipment_id === selectedLcId);
  const skill = lcSkills.find((e) => e.skill_id === metadata?.skill_id);

  if (!metadata || !skill) return null;

  const sortedLcs = lcMetadatas.sort((a, b) => b.rarity - a.rarity);

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col p-6">
          <Portrait data={metadata} />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="grid grid-cols-4">
            {sortedLcs.map((lc, index) => (
              <div
                className="relative p-2"
                key={index}
                onClick={() => {
                  setSelectedLcId(lc.equipment_id);
                }}
              >
                <LightConeCard
                  imgUrl={url(lc.equipment_id)}
                  name={lc.equipment_name}
                />
              </div>
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
