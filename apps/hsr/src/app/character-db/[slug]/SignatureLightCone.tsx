"use client";

import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { Content } from "@hsr/app/lightcone-db/[slug]/Content";
import { Portrait } from "@hsr/app/lightcone-db/[slug]/Portrait";
import { IMAGE_URL } from "@hsr/lib/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "protocol/trpc";
import { byCharId } from "protocol/ts/atlas-SignatureAtlasService_connectquery";
import { useState } from "react";

interface Prop {
  characterId: number;
  signatures: inferRouterOutputs<AppRouter>["honkai"]["avatar"]["signatures"];
}

function SignatureLightCone({ characterId, signatures }: Prop) {
  const { data } = useSuspenseQuery(byCharId.useQuery({ charId: characterId }));
  const { lcIds } = data;

  const [selectedLcId, setSelectedLcId] = useState(lcIds.at(0));

  const selectedLc = signatures.find((e) => e.id === selectedLcId);

  if (!selectedLc) return null;

  const sortedLcs = signatures.sort(
    (a, b) => (b.rarity ?? 0) - (a.rarity ?? 0)
  );

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col p-6">
          <Portrait lightconeId={selectedLc.id} name={selectedLc.name ?? ""} />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="grid grid-cols-4">
            {sortedLcs.map((lc) => (
              <button
                className="relative p-2 cursor-default"
                key={lc.id}
                onClick={() => {
                  setSelectedLcId(lc.id);
                }}
                type="button"
              >
                <LightConeCard imgUrl={url(lc.id)} name={lc.name ?? ""} />
              </button>
            ))}
          </div>

          <Content
            lcId={selectedLc.id}
            link
            name={selectedLc.name ?? ""}
            skill={{
              name: selectedLc.skill?.name ?? "",
              paramList: selectedLc.skill?.paramList ?? [],
              skillDesc: selectedLc.skill?.desc ?? [],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { SignatureLightCone };

function url(id: string | number): string {
  return `${IMAGE_URL}image/light_cone_preview/${id}.png`;
}
