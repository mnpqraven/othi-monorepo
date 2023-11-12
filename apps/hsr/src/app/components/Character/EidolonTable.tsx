import Image from "next/image";
import { Fragment } from "react";
import { sanitizeNewline } from "lib/utils";
import { Badge, Toggle } from "ui/primitive";
import { server } from "@hsr/app/_trpc/serverClient";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "protocol/trpc";
import Link from "next/link";

interface Prop {
  characterId: number;
  searchParams: Record<string, string | undefined>;
}

export async function EidolonTable({ characterId, searchParams }: Prop) {
  const selectedEidolon = Number(searchParams.i ?? 1);
  const eidolons = await server.honkai.avatar.eidolons({ charId: characterId });

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
        searchParams={searchParams}
        selectedEidolon={selectedEidolon}
      />

      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4">
        {currentEidolon?.desc.map((descPart, index) => (
          // eslint-disable-next-line react/no-array-index-key
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
        searchParams={searchParams}
        selectedEidolon={selectedEidolon}
      />
    </>
  );
}

interface EidolonRowProps {
  data: inferRouterOutputs<AppRouter>["honkai"]["avatar"]["eidolons"];
  selectedEidolon: number;
  characterId: number;
  searchParams: Record<string, string | undefined>;
}
function EidolonRow({
  data,
  selectedEidolon,
  characterId,
  searchParams,
}: EidolonRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((eidolon) => (
        <Toggle
          asChild
          className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
          key={eidolon.rank}
          pressed={selectedEidolon === eidolon.rank}
        >
          <Link href={{ query: { ...searchParams, i: eidolon.rank } }}>
            <div className="flex flex-col items-center gap-1">
              <Image
                alt={eidolon.name}
                className="aspect-square min-w-[64px] invert dark:invert-0"
                height={64}
                src={url(characterId, eidolon.rank)}
                width={64}
              />
              <Badge className="w-fit sm:inline">E{eidolon.rank}</Badge>
            </div>

            <span className="md:text-lg">{eidolon.name}</span>
          </Link>
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
