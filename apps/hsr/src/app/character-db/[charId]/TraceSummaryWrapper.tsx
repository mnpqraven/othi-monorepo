"use client";

import { TraceSummary } from "@hsr/app/components/Character/TraceSummary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/primitive";
import { useProperties } from "@hsr/hooks/queries/useProperties";
import { trpc } from "@hsr/app/_trpc/client";

interface Prop {
  characterId: number;
}
function TraceSummaryWrapper({ characterId }: Prop) {
  const { data: traces } = trpc.honkai.avatar.trace.by.useQuery(
    { charId: characterId },
    { enabled: Boolean(characterId) }
  );
  const { data: properties } = useProperties();

  if (!traces || !properties) return null;

  return (
    <Accordion
      className="w-full rounded-md border p-4"
      collapsible
      type="single"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="py-0">
          Total gain from traces
        </AccordionTrigger>
        <AccordionContent asChild>
          <TraceSummary properties={properties} traces={traces} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export { TraceSummaryWrapper };
