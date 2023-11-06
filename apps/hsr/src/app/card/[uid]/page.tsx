import { ConfigController } from "./ConfigControllerDialog";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { Share } from "./_components/Share";
import { LANGS } from "@hsr/lib/constants";
import { DisplayCard } from "../custom/_viewer/DisplayCard";
import { StateProvider } from "@hsr/app/components/StateProvider";
import { Metadata } from "next";

interface Props {
  params: { uid: string };
  searchParams: { lang: (typeof LANGS)[number] | undefined };
}

export const metadata: Metadata = {
  title: "Honkai Star Rail Character Card",
  description: "Honkai Star Rail Character Card",
};

export default async function ProfileCard({
  params: { uid },
  searchParams: { lang },
}: Props) {
  return (
    <StateProvider devTools>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <LineupSelector />
          <Exporter />
          <Share />
          <ConfigController />
        </div>

        <DisplayCard uid={uid} lang={lang} mode="API" />
      </main>
    </StateProvider>
  );
}
