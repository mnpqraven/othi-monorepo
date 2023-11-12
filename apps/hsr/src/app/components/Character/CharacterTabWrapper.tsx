import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/primitive";
import { useQueryClient } from "@tanstack/react-query";
import API from "@hsr/server/typedEndpoints";
import type { ReactNode } from "react";
import { SkillOverview } from "./SkillOverview";
import { TraceTable } from "./TraceTable";

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

  return (
    <Tabs defaultValue="skills">
      <TabsList>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="eidolons">Eidolons</TabsTrigger>
        <TabsTrigger value="traces">Traces</TabsTrigger>
      </TabsList>

      <TabsContent value="skills">
        <SkillOverview characterId={characterId} />
      </TabsContent>

      <TabsContent value="eidolons">{eidolonTableChildren}</TabsContent>

      <TabsContent className="h-[30rem]" value="traces">
        <div className="flex justify-center">
          <TraceTable characterId={characterId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
