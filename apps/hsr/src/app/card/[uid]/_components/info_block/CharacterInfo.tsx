import type { HTMLAttributes } from "react";
import { forwardRef, useMemo } from "react";
import { RarityIcon } from "@hsr/app/character-db/CharacterCardWrapper";
import { img } from "@hsr/lib/utils";
import { Badge } from "ui/primitive";
import { PathIcon } from "@hsr/app/character-db/PathIcon";
import { ElementIcon } from "@hsr/app/character-db/ElementIcon";
import { useAtomValue } from "jotai";
import {
  charEidAtom,
  charLevelAtom,
  charPromotionAtom,
  configAtom,
} from "@hsr/app/card/_store";
import { cn } from "lib/utils";
import type { Element, Path } from "@hsr/bindings/AvatarConfig";
import { selectAtom } from "jotai/utils";
import { trpc } from "@hsr/app/_trpc/client";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}

export const CharacterInfo = forwardRef<HTMLDivElement, Prop>(
  ({ className, characterId, ...props }: Prop, ref) => {
    const { data } = trpc.honkai.avatar.by.useQuery({ charId: characterId });
    const level = useAtomValue(charLevelAtom);
    const ascension = useAtomValue(charPromotionAtom);
    const eidolon = useAtomValue(charEidAtom);

    if (!data) return null;

    const maxLevel = ascension * 10 + 20;

    return (
      <div
        className={cn("flex flex-col items-center justify-between", className)}
        ref={ref}
        {...props}
      >
        <div
          className="absolute top-11 -z-10 flex h-[512px] w-[374px] items-center"
          id="left-avatar"
          style={{
            backgroundImage: `url(${img(
              `image/character_preview/${characterId}.png`
            )})`,
            backgroundRepeat: "no-repeat",
            boxShadow: "0 0 10px 10px hsl(var(--background)) inset",
          }}
        />

        <div className="grid w-full grid-cols-3">
          <UserPlateLeft path={data.path} />

          <div className="flex flex-col items-center place-self-center">
            <div className="font-bold">{data.name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span>/{maxLevel}
            </div>

            <div>
              <Badge>Eidolon {eidolon}</Badge>
            </div>
          </div>

          <UserPlateRight element={data.element} path={data.path} />
        </div>

        <RarityIcon
          className="static h-12 w-full"
          id="rarity"
          rarity={data.rarity}
        />
      </div>
    );
  }
);

CharacterInfo.displayName = "CharacterInfo";

function UserPlateLeft({ path }: { path: Path }) {
  const playerInfoAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.showPlayerInfo),
    []
  );
  const playerNameAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.name),
    []
  );
  const showPlayerInfo = useAtomValue(playerInfoAtom);
  const name = useAtomValue(playerNameAtom);
  if (showPlayerInfo)
    return (
      <div className="flex flex-col">
        <span className="font-bold">{name}</span>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-end">
      <PathIcon className="flex-1" path={path} size="30px" />
      <Badge>{path}</Badge>
    </div>
  );
}
function UserPlateRight({ path, element }: { path: Path; element: Element }) {
  const playerInfoAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.showPlayerInfo),
    []
  );
  const showPlayerInfo = useAtomValue(playerInfoAtom);
  if (showPlayerInfo)
    return (
      <div className="relative flex justify-evenly">
        <div className="absolute bottom-0 h-full w-[1px] rotate-45 border" />
        <PathIcon path={path} size="30px" />
        <ElementIcon className="self-end" element={element} size="30px" />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-end">
      <ElementIcon className="flex-1" element={element} size="30px" />
      <Badge>{element}</Badge>
    </div>
  );
}
