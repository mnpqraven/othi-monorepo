"use client";

import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import { useSuspenseQuery } from "@tanstack/react-query";
import { characterMetadatasQ } from "@hsr/hooks/queries/character";
import useCharacterFilter from "../components/Db/useCharacterFilter";
import { DbFilter } from "../components/Db/DbFilter";
import { CharacterCatalogueItem } from "./CharacterCatalogueItem";

function search(data: AvatarConfig[], query: string | undefined) {
  const fz = new Fuse(data, {
    keys: [
      "avatar_name",
      "avatar_id",
      "avatar_votag",
    ] satisfies (keyof AvatarConfig)[],
    threshold: 0.4,
  });

  if (query?.length) return fz.search(query).map((e) => e.item);
  return data;
}

function CharacterCatalogue() {
  const router = useRouter();
  const { filter, query, updateQuery } = useCharacterFilter();

  const { data } = useSuspenseQuery(characterMetadatasQ());

  const processedData = search(data, query)
    .filter(filter.byRarity)
    .filter(filter.byPath)
    .filter(filter.byElement);

  function onEnter(_query: string) {
    if (processedData.length)
      router.push(`/character-db/${processedData.at(0)?.avatar_id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        onEnterKey={onEnter}
        updateText={updateQuery}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((chara) => (
          <CharacterCatalogueItem chara={chara} key={chara.avatar_id} />
        ))}
      </div>
    </div>
  );
}
export default CharacterCatalogue;
