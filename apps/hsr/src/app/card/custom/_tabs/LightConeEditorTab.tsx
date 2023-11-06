"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Toggle,
} from "ui/primitive";
import { useLightConeList } from "@hsr/hooks/queries/useLightConeList";
import { useAtom, useAtomValue } from "jotai";
import { useCharacterMetadata } from "@hsr/hooks/queries/useCharacterMetadata";
import Image from "next/image";
import { IMAGE_URL } from "@hsr/lib/constants";
import { HTMLAttributes, forwardRef, useState } from "react";
import { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { useLightConeMetadata } from "@hsr/hooks/queries/useLightConeMetadata";
import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { img } from "@hsr/lib/utils";
import { LightConeUpdater } from "../_editor/LightConeUpdater";
import { charIdAtom, lcIdAtom } from "../../_store";
import { cn } from "lib";

export const LightConeEditorTab = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: lightConeList } = useLightConeList();
  const charId = useAtomValue(charIdAtom);
  const [open, setOpen] = useState(false);
  const [lcId, setLcId] = useAtom(lcIdAtom);

  const { data: charMeta } = useCharacterMetadata(charId);
  const { lightCone } = useLightConeMetadata(lcId);
  const path = charMeta?.avatar_base_type;

  function onSelectLightCone(lc: EquipmentConfig) {
    setLcId(lc.equipment_id);
    setOpen(false);
  }

  return (
    <div className={cn("flex gap-4", className)} {...props} ref={ref}>
      <div className="flex flex-col items-center gap-6 p-4">
        <Dialog open={open} onOpenChange={setOpen}>
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
                    key={lc.equipment_id}
                    className="flex h-fit justify-between py-2"
                    onPressedChange={() => onSelectLightCone(lc)}
                  >
                    <Image
                      src={`${IMAGE_URL}image/light_cone_preview/${lc.equipment_id}.png`}
                      alt={lc.equipment_name}
                      width={256}
                      height={300}
                      className="aspect-[256/300] w-16"
                    />
                    <span>{lc.equipment_name}</span>
                  </Toggle>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {!!lightCone && (
          <LightConeCard
            className="w-48"
            name={lightCone.equipment_name}
            imgUrl={img(
              `image/light_cone_preview/${lightCone.equipment_id}.png`
            )}
          />
        )}

        {lightCone?.equipment_name}
      </div>

      <LightConeUpdater />
    </div>
  );
});
LightConeEditorTab.displayName = "LightConeEditorTab";
