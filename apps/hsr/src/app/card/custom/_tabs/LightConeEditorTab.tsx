"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Toggle,
} from "ui/primitive";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { IMAGE_URL } from "@hsr/lib/constants";
import type { HTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { LightConeCard } from "@hsr/app/lightcone-db/LightConeCard";
import { img } from "@hsr/lib/utils";
import { cn } from "lib";
import { trpc } from "protocol";
import type { LightConeSchema } from "database/schema";
import { charIdAtom, lcIdAtom } from "../../_store";
import { LightConeUpdater } from "../_editor/LightConeUpdater";

export const LightConeEditorTab = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: lightConeList } = trpc.honkai.lightCone.list.useQuery(
    {},
    { initialData: [] }
  );
  const charId = useAtomValue(charIdAtom);
  const [open, setOpen] = useState(false);
  const setLcId = useSetAtom(lcIdAtom);
  const [localLc, setLocalLc] = useState<LightConeSchema | undefined>(
    undefined
  );

  const { data: charMeta } = trpc.honkai.avatar.by.useQuery(
    { charId: Number(charId) },
    { enabled: Boolean(charId) }
  );

  function onSelectLightCone(lc: LightConeSchema) {
    setLcId(lc.id);
    setLocalLc(lc);
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
                .filter((e) => e.path === charMeta?.path)
                .map((lc) => (
                  <Toggle
                    className="flex h-fit justify-between py-2"
                    key={lc.id}
                    onPressedChange={() => {
                      onSelectLightCone(lc);
                    }}
                  >
                    <Image
                      alt={lc.name}
                      className="aspect-[256/300] w-16"
                      height={300}
                      src={`${IMAGE_URL}image/light_cone_preview/${lc.id}.png`}
                      width={256}
                    />
                    <span>{lc.name}</span>
                  </Toggle>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {localLc ? (
          <>
            <LightConeCard
              className="w-48"
              imgUrl={img(`image/light_cone_preview/${localLc.id}.png`)}
              name={localLc.name}
            />
            {localLc.name}
          </>
        ) : null}
      </div>

      <LightConeUpdater />
    </div>
  );
});
LightConeEditorTab.displayName = "LightConeEditorTab";
