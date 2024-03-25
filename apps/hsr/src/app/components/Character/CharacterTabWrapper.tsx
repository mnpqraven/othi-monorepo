import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/primitive";
import { useQueryClient } from "@tanstack/react-query";
import API from "@hsr/server/typedEndpoints";
import { useMemo, type ReactNode } from "react";
import { trpc } from "protocol";
import { sortSkillsByDesc } from "@hsr/lib/utils";
import { useSearchParams } from "next/navigation";
import { SkillOverview } from "./SkillOverview";
import { TraceTable } from "./TraceTable";
import { SkillSelector } from "./SkillSelector";

interface Prop {
  characterId: number;
  eidolonTableChildren?: ReactNode;
}
export function CharacterTabWrapper({
  characterId,
  eidolonTableChildren,
}: Prop) {
  const client = useQueryClient();
  void client.prefetchQuery({
    queryKey: ["properties"],
    queryFn: () => API.properties.get(),
  });
  const { data: skills } = trpc.honkai.skill.by.useQuery(
    { charId: characterId },
    { select: (data) => data.sort(sortSkillsByDesc), initialData: [] }
  );
  const searchParams = useSearchParams();
  const selectedSkillId = useMemo(
    () => Number(searchParams.get("id") ?? skills.at(0)?.id),
    [searchParams, skills]
  );

  return (
    <Tabs defaultValue="skill">
      <TabsList>
        <TabsTrigger value="skill">Skills</TabsTrigger>
        <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
        <TabsTrigger value="traces">Traces</TabsTrigger>
      </TabsList>

      <TabsContent value="skill">
        <SkillOverview characterId={characterId} selectedId={selectedSkillId}>
          <SkillSelector
            characterId={characterId}
            selectedId={selectedSkillId}
            skills={skills}
          />
        </SkillOverview>
      </TabsContent>

      <TabsContent value="eidolon">{eidolonTableChildren}</TabsContent>

      <TabsContent className="h-[30rem]" value="traces">
        <div className="flex justify-center">
          <TraceTable characterId={characterId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
