import type { LANGS } from "@hsr/lib/constants";
import type { Metadata } from "next";
import { DisplayCard } from "../custom/_viewer/DisplayCard";
import { ConfigController } from "./ConfigControllerDialog";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { Share } from "./_components/Share";

interface Prop {
  params: { uid: string };
  searchParams: { lang: (typeof LANGS)[number] | undefined };
}

export const metadata: Metadata = {
  title: "Honkai Star Rail Character Card",
  description: "Honkai Star Rail Character Card",
};

export default function ProfileCard({
  params: { uid },
  searchParams: { lang },
}: Prop) {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="mt-2 flex items-center justify-center gap-2">
        <LineupSelector />
        <Exporter />
        <Share />
        <ConfigController />
      </div>

      <DisplayCard lang={lang} mode="API" uid={uid} />
    </main>
  );
}
