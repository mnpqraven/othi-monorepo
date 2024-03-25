"use client";

import { DbFilter } from "@hsr/app/components/Db/DbFilter";
import useCharacterFilter from "@hsr/app/components/Db/useCharacterFilter";
import { img } from "@hsr/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { Suspense, forwardRef, useState } from "react";
import { CharacterCard } from "@hsr/app/character-db/CharacterCardWrapper";
import { cn } from "lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Toggle,
} from "ui/primitive";
import { trpc } from "protocol";
import type { AvatarSchema } from "database/schema";
import { CharacterUpdater } from "../_editor/CharacterUpdater";
import { TraceTableUpdater } from "../_editor/TraceTableUpdater";
import { charIdAtom, lcIdAtom } from "../../_store";

export const CharacterEditorTab = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [charId, updateId] = useAtom(charIdAtom);
  const updateLcId = useSetAtom(lcIdAtom);
  const { data: chara } = trpc.honkai.avatar.by.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { charId: charId! },
    { enabled: Boolean(charId) }
  );
  const { data: characterList } = trpc.honkai.avatar.list.useQuery(
    {},
    { initialData: [] }
  );
  const [open, setOpen] = useState(false);
  const { filter } = useCharacterFilter();

  const sorted = characterList
    .filter(filter.byElement)
    .filter(filter.byPath)
    .filter(filter.byRarity);

  function onCharacterSelect(to: AvatarSchema) {
    updateId(to.id);
    updateLcId(undefined);
    setOpen(false);
  }

  return (
    <div className={cn("flex gap-4", className)} {...props} ref={ref}>
      <div className="flex flex-col items-center gap-6 p-4">
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button variant="outline">Select Character</Button>
          </DialogTrigger>

          <DialogContent className="max-w-5xl">
            <DbFilter minRarity={4} {...filter} />

            <div className="grid grid-cols-4">
              {sorted.map((chara) => (
                <CharacterSelectItem
                  chara={chara}
                  key={chara.id}
                  onSelect={onCharacterSelect}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {chara ? (
          <CharacterCard
            className="w-48 p-4"
            element={chara.element}
            imgUrl={url(chara.id)}
            name={chara.name}
            path={chara.path}
            rarity={chara.rarity}
          />
        ) : null}

        {chara?.name}
      </div>

      {charId ? (
        <Suspense fallback={<div>loading state..</div>}>
          <CharacterUpdater />
        </Suspense>
      ) : null}

      {chara ? <TraceTableUpdater path={chara.path} /> : null}
    </div>
  );
});
CharacterEditorTab.displayName = "CharacterEditorTab";

interface ItemProps {
  chara: AvatarSchema;
  onSelect: (to: AvatarSchema) => void;
}
function CharacterSelectItem({ chara, onSelect }: ItemProps) {
  return (
    <Toggle
      className="flex h-auto items-start justify-start p-2"
      onPressedChange={() => {
        onSelect(chara);
      }}
    >
      <Image
        alt={chara.name}
        height={64}
        src={avatarUrl(chara.id)}
        width={64}
      />
      <span className="grow justify-self-center">{chara.name}</span>
    </Toggle>
  );
}

function avatarUrl(id: number) {
  return img(`/icon/avatar/${id}.png`);
}

function url(id: string | number): string {
  return img(`image/character_preview/${id}.png`);
}
