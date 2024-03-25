import { server } from "protocol/trpc";
import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { Content } from "@hsr/app/lightcone-db/[lcId]/Content";
import { Portrait } from "@hsr/app/lightcone-db/[lcId]/Portrait";
import { IMAGE_URL } from "@hsr/lib/constants";
import Link from "next/link";

interface Prop {
  characterId: number;
  searchParams: Record<string, string | undefined>;
}

export async function SignatureLightCone({ characterId, searchParams }: Prop) {
  const signatures = (
    await server().honkai.avatar.signatures({
      charId: characterId,
      skill: true,
    })
  ).sort((a, b) => b.rarity - a.rarity);

  const selectedLc = signatures[Number(searchParams.i ?? 0)];

  if (!selectedLc) return null;

  const { skill } = selectedLc;

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col p-6">
          <Portrait lightconeId={selectedLc.id} name={selectedLc.name} />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="grid grid-cols-4">
            {signatures.map((lc, i) => (
              <Link href={{ query: { ...searchParams, i } }} key={lc.id}>
                <button
                  className="relative cursor-default p-2"
                  key={lc.id}
                  type="button"
                >
                  <LightConeCard imgUrl={url(lc.id)} name={lc.name} />
                </button>
              </Link>
            ))}
          </div>

          {skill ? (
            <Content
              lcId={selectedLc.id}
              link
              name={selectedLc.name}
              skill={{ ...skill }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function url(id: string | number): string {
  return `${IMAGE_URL}image/light_cone_preview/${id}.png`;
}
