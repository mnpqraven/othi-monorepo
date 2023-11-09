"use client";

import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import Link from "next/link";
import { IMAGE_URL } from "@hsr/lib/constants";
import { CharacterCard } from "./CharacterCardWrapper";

interface Prop {
  chara: AvatarConfig;
}
export function CharacterCatalogueItem({ chara }: Prop) {
  return (
    <div
      className="flex flex-col gap-2"
      id="character-card"
      key={chara.avatar_id}
    >
      <Link href={`/character-db/${chara.avatar_id}`}>
        <CharacterCard
          avatar_base_type={chara.avatar_base_type}
          avatar_name={chara.avatar_name}
          damage_type={chara.damage_type}
          imgUrl={url(chara.avatar_id)}
          rarity={chara.rarity}
        />
      </Link>

      <Link
        className="flex grow items-center justify-center text-center"
        href={`/character-db/${chara.avatar_id}`}
      >
        {chara.avatar_name}
      </Link>
    </div>
  );
}

function url(id: string | number): string {
  return `${IMAGE_URL}image/character_preview/${id}.png`;
}
