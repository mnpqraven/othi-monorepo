import Link from "next/link";
import { IMAGE_URL } from "@hsr/lib/constants";
import type { AvatarSchema } from "database/schema";
import { CharacterCard } from "./CharacterCardWrapper";

interface Prop {
  chara: AvatarSchema;
}
export function CharacterCatalogueItem({ chara }: Prop) {
  return (
    <div className="flex flex-col gap-2" id="character-card" key={chara.id}>
      <Link href={`/character-db/${chara.id}`}>
        <CharacterCard
          path={chara.path}
          name={chara.name}
          element={chara.element}
          imgUrl={url(chara.id)}
          rarity={chara.rarity}
        />
      </Link>

      <Link
        className="flex grow items-center justify-center text-center"
        href={`/character-db/${chara.id}`}
      >
        {chara.name}
      </Link>
    </div>
  );
}

function url(id: string | number): string {
  return `${IMAGE_URL}image/character_preview/${id}.png`;
}
