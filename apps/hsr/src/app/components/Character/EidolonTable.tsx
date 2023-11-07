"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { sanitizeNewline } from "lib/utils";
import type { AvatarRankConfig } from "@hsr/bindings/AvatarRankConfig";
import { useSuspendedCharacterEidolon } from "@hsr/hooks/queries/useCharacterEidolon";
import { Badge, Skeleton, Toggle } from "ui/primitive";

interface Prop {
  characterId: number;
}

function EidolonTable({ characterId }: Prop) {
  const [selectedEidolon, setSelectedEidolon] = useState(1);
  const { eidolons } = useSuspendedCharacterEidolon(characterId);

  const top = eidolons
    .filter((e) => e.rank <= 3)
    .sort((a, b) => a.rank - b.rank);
  const bottom = eidolons
    .filter((e) => e.rank > 3)
    .sort((a, b) => a.rank - b.rank);

  const currentEidolon = eidolons.find((e) => e.rank === selectedEidolon);

  return (
    <>
      <EidolonRow
        characterId={characterId}
        data={top}
        selectedEidolon={selectedEidolon}
        setSelectedEidolon={setSelectedEidolon}
      />

      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4">
        {currentEidolon?.desc.map((descPart, index) => (
          <Fragment key={index}>
            <span className="whitespace-pre-wrap">
              {sanitizeNewline(descPart)}
            </span>
            <span className="text-accent-foreground font-semibold">
              {currentEidolon.param[index]}
            </span>
          </Fragment>
        ))}
      </div>

      <EidolonRow
        characterId={characterId}
        data={bottom.reverse()}
        selectedEidolon={selectedEidolon}
        setSelectedEidolon={setSelectedEidolon}
      />
    </>
  );
}

interface EidolonRowProps {
  data: AvatarRankConfig[];
  selectedEidolon: number;
  setSelectedEidolon: (value: number) => void;
  characterId: number;
}
function EidolonRow({
  data,
  selectedEidolon,
  setSelectedEidolon,
  characterId,
}: EidolonRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((eidolon) => (
        <Toggle
          className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
          key={eidolon.rank_id}
          onPressedChange={() => {
            setSelectedEidolon(eidolon.rank);
          }}
          pressed={selectedEidolon === eidolon.rank}
        >
          <div className="flex flex-col items-center gap-1">
            <Image
              alt={eidolon.name}
              className="aspect-square min-w-[64px] invert dark:invert-0"
              height={64}
              onClick={() => {
                setSelectedEidolon(eidolon.rank);
              }}
              src={url(characterId, eidolon.rank)}
              width={64}
            />
            <Badge className="w-fit sm:inline">E{eidolon.rank}</Badge>
          </div>

          <span className="md:text-lg">{eidolon.name}</span>
        </Toggle>
      ))}
    </div>
  );
}

function url(charID: number, eidolon: number) {
  let fmt = `rank${eidolon}`;
  if (eidolon === 3) fmt = "skill";
  if (eidolon === 5) fmt = "ultimate";
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${charID}_${fmt}.png`;
}

function LoadingEidolonTable() {
  function Row({ keys }: { keys: number[] }) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <Toggle
            className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
            key={key}
            pressed={key === 1}
          >
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Badge className="w-fit sm:inline">E{key}</Badge>
            </div>
            <span className="md:text-lg"> </span>
          </Toggle>
        ))}
      </div>
    );
  }
  return (
    <>
      <Row keys={[1, 2, 3]} />
      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4" />
      <Row keys={[6, 5, 4]} />
    </>
  );
}

export { EidolonTable, LoadingEidolonTable };
