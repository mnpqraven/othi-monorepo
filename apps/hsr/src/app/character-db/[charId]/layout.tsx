import { img } from "@hsr/lib/utils";
import Image from "next/image";

interface Prop {
  children: React.ReactNode;
  params: { charId: string };
}
export default function Layout({ children, params }: Prop) {
  const characterId = parseInt(params.charId);

  return (
    <main className="grid grid-cols-1 overflow-hidden px-2 pt-4 lg:grid-cols-2">
      <div className="aspect-square">
        <Image
          alt={params.charId}
          className="place-self-start object-contain"
          height={2048}
          src={img(`image/character_portrait/${characterId}.png`)}
          width={2048}
        />
      </div>
      {children}
    </main>
  );
}
