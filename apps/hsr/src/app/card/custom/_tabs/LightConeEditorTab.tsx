"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Toggle,
} from "ui/primitive";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import { IMAGE_URL } from "@hsr/lib/constants";
import type { HTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { img } from "@hsr/lib/utils";
import { cn } from "lib";
import { useQuery } from "@tanstack/react-query";
import { characterMetadataQ } from "@hsr/hooks/queries/character";
import { lightConeMetadataQ, lightConesQ } from "@hsr/hooks/queries/lightcone";
import { charIdAtom, lcIdAtom } from "../../_store";
import { LightConeUpdater } from "../_editor/LightConeUpdater";

export const LightConeEditorTab = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: lightConeList } = useQuery(lightConesQ());
  const charId = useAtomValue(charIdAtom);
  const [open, setOpen] = useState(false);
  const [lcId, setLcId] = useAtom(lcIdAtom);

  const { data: charMeta } = useQuery(characterMetadataQ(charId));
  const { data: lightCone } = useQuery(lightConeMetadataQ(lcId));
  const path = charMeta?.avatar_base_type;

  function onSelectLightCone(lc: EquipmentConfig) {
    setLcId(lc.equipment_id);
    setOpen(false);
  }

  return (
    <div className={cn("flex gap-4", className)} {...props} ref={ref}>
      <div className="flex flex-col items-center gap-6 p-4">
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button variant="outline">Select Light Cone</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-4">
              {lightConeList
                .sort(
                  (a, b) =>
                    b.rarity - a.rarity ||
                    a.equipment_name.localeCompare(b.equipment_name)
                )
                .filter((e) => e.avatar_base_type === path)
                .map((lc) => (
                  <Toggle
                    className="flex h-fit justify-between py-2"
                    key={lc.equipment_id}
                    onPressedChange={() => {
                      onSelectLightCone(lc);
                    }}
                  >
                    <Image
                      alt={lc.equipment_name}
                      className="aspect-[256/300] w-16"
                      height={300}
                      src={`${IMAGE_URL}image/light_cone_preview/${lc.equipment_id}.png`}
                      width={256}
                    />
                    <span>{lc.equipment_name}</span>
                  </Toggle>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {lightCone ? (
          <>
            <LightConeCard
              className="w-48"
              imgUrl={img(
                `image/light_cone_preview/${lightCone.equipment_id}.png`
              )}
              name={lightCone.equipment_name}
            />
            {lightCone.equipment_name}
          </>
        ) : null}
      </div>

      <LightConeUpdater />
    </div>
  );
});
LightConeEditorTab.displayName = "LightConeEditorTab";
