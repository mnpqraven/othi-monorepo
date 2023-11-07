import {
  EidolonTable,
  LoadingEidolonTable,
} from "@hsr/app/components/Character/EidolonTable";
import {
  SkillOverview,
  SkillOverviewLoading,
} from "@hsr/app/components/Character/SkillOverview";
import { TraceTable } from "@hsr/app/components/Character/TraceTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/primitive";
import { Suspense } from "react";
import getQueryClient from "@hsr/lib/queryClientHelper";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  characterEidolonsQ,
  characterMetadataQ,
  characterSignatureQ,
  characterSkillQ,
  characterTraceQ,
} from "@hsr/hooks/queries/character";
import { optionsProperties } from "@hsr/hooks/queries/useProperties";
import { SignatureLightCone } from "./SignatureLightCone";
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";
import Loading from "./loading";

interface Prop {
  params: { slug: string };
}

export default async function Character({ params }: Prop) {
  const characterId = parseInt(params.slug);
  const dehydratedState = await prefetchOptions(characterId);

  return (
    <Tabs defaultValue="skill">
      <TabsList className="h-fit [&>*]:whitespace-pre-wrap">
        <TabsTrigger value="skill">Skills</TabsTrigger>
        <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
        <TabsTrigger value="sig-lc">Featured Light Cone</TabsTrigger>
        <TabsTrigger value="trace">Traces</TabsTrigger>
      </TabsList>

      <HydrationBoundary state={dehydratedState}>
        <TabsContent value="skill">
          <Suspense fallback={<SkillOverviewLoading />}>
            <SkillOverview characterId={characterId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="eidolon">
          <Suspense fallback={<LoadingEidolonTable />}>
            <EidolonTable characterId={characterId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="sig-lc">
          <Suspense fallback={<Loading />}>
            <SignatureLightCone characterId={characterId} />
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
      </HydrationBoundary>
    </Tabs>
  );
}

async function prefetchOptions(characterId: number) {
  const queryClient = getQueryClient();
  const options = [
    characterSkillQ(characterId),
    characterMetadataQ(characterId),
    characterEidolonsQ(characterId),
    characterSignatureQ(characterId),
    characterTraceQ(characterId),
    optionsProperties(),
  ];
  await Promise.allSettled(
    options.map((option) => queryClient.prefetchQuery(option))
  );
  return dehydrate(queryClient);
}
