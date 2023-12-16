import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import { ConfigController } from "../[uid]/ConfigControllerDialog";
import { Exporter } from "../[uid]/_components/Exporter";
import { DisplayCard } from "./_viewer/DisplayCard";
import { RelicEditorTab } from "./_tabs/RelicEditorTab";
import { LightConeEditorTab } from "./_tabs/LightConeEditorTab";
import { CharacterEditorTab } from "./_tabs/CharacterEditorTab";

export const metadata: Metadata = {
  title: "Honkai Star Rail Card Maker",
  description: "Custom card maker for your Honkai Star Rail characters",
};

export default function ProfileCard() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="mt-2 flex items-center justify-center gap-2">
        <Button variant="outline">
          <Link href="/card">Use UID</Link>
        </Button>
        <Exporter />
        <ConfigController />
      </div>
      <Accordion
        className="w-10/12"
        defaultValue={["config", "card"]}
        type="multiple"
      >
        <AccordionItem value="config">
          <AccordionTrigger>Configuration</AccordionTrigger>
          <AccordionContent className="py-2">
            <Tabs className="w-full" defaultValue="charlc">
              <div className="flex">
                <TabsList>
                  <TabsTrigger value="charlc">
                    Character & Light Cone
                  </TabsTrigger>
                  <TabsTrigger value="relic">Relics</TabsTrigger>
                </TabsList>

                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="mx-2 text-yellow-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Substat roll window is still under development, expect bugs
                    here and there.
                    <br />
                    If you encounter a bug when setting up relics, contact Othi
                    with a rough step-by-step on how you got the bug
                  </TooltipContent>
                </Tooltip>
              </div>

              <TabsContent
                className="flex justify-between gap-2"
                value="charlc"
              >
                <CharacterEditorTab className="flex-[2_2_0%]" />

                <Separator className="h-auto" orientation="vertical" />

                <LightConeEditorTab className="flex-1" />
              </TabsContent>
              <TabsContent value="relic">
                <RelicEditorTab />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="card">
          <AccordionTrigger>Card</AccordionTrigger>
          <AccordionContent className="flex justify-center py-2">
            <DisplayCard mode="CUSTOM" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
