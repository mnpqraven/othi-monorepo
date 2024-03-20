import { EidolonTable } from "@hsr/app/components/Character/EidolonTable";
import { SkillOverview } from "@hsr/app/components/Character/SkillOverview";
import { TraceTable } from "@hsr/app/components/Character/TraceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/primitive";
import { Suspense } from "react";
import Link from "next/link";
import { LoadingEidolonTable } from "@hsr/app/components/Character/LoadingEidolonTable";
import { SkillOverviewLoading } from "@hsr/app/components/Character/SkillOverviewLoading";
import { SkillSelector } from "@hsr/app/components/Character/SkillSelector";
import { server } from "@hsr/app/_trpc/serverClient";
import { sortSkillsByDesc } from "@hsr/lib/utils";
import Loading from "@hsr/app/card/[uid]/loading";
import { SignatureLightCone } from "./SignatureLightCone";
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";

interface Prop {
  params: { charId: string };
  searchParams: Record<string, string | undefined>;
}

export default async function Character({ params, searchParams }: Prop) {
  const characterId = parseInt(params.charId);
  const _testValidity = await server.honkai.avatar.by({ charId: characterId });
  const skills = await server.honkai.skill
    .by({ charId: characterId })
    .then((data) => data.sort(sortSkillsByDesc));
  const selectedId = Number(searchParams.id ?? skills.at(0)?.id);

  return (
    <Tabs defaultValue={searchParams.tab ?? "skill"}>
      <TabsList className="h-fit [&>*]:whitespace-pre-wrap">
        <TabsTrigger asChild value="skill">
          <Link href={{ query: { tab: "skill" } }}>Skills</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="eidolon">
          <Link href={{ query: { tab: "eidolon" } }}>Eidolons</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="signature">
          <Link href={{ query: { tab: "signature" } }}>
            Featured Light Cone
          </Link>
        </TabsTrigger>
        <TabsTrigger asChild value="trace">
          <Link href={{ query: { tab: "trace" } }}>Traces</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="skill">
        <Suspense fallback={<SkillOverviewLoading />}>
          <SkillOverview characterId={characterId} selectedId={selectedId}>
            <SkillSelector
              characterId={characterId}
              selectedId={selectedId}
              skills={skills}
            />
          </SkillOverview>
        </Suspense>
      </TabsContent>

      <TabsContent value="eidolon">
        <Suspense fallback={<LoadingEidolonTable />}>
          <EidolonTable characterId={characterId} searchParams={searchParams} />
        </Suspense>
      </TabsContent>

      <TabsContent value="signature">
        <Suspense fallback={<Loading />}>
          <SignatureLightCone
            characterId={characterId}
            searchParams={searchParams}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="trace">
        <div className="mt-2 flex flex-col items-center gap-4 xl:flex-row xl:items-start">
          <div className="flex w-[30rem] grow justify-center">
            <TraceTable characterId={characterId} wrapperSize={480} />
          </div>

          <div className="w-full">
            <TraceSummaryWrapper characterId={characterId} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
