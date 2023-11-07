"use client";

import { DbFilter } from "@hsr/app/components/Db/DbFilter";
import useCharacterFilter from "@hsr/app/components/Db/useCharacterFilter";
import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
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
import { useQuery } from "@tanstack/react-query";
import {
  characterMetadataQ,
  characterMetadatasQ,
} from "@hsr/hooks/queries/character";
import { CharacterUpdater } from "../_editor/CharacterUpdater";
import { TraceTableUpdater } from "../_editor/TraceTableUpdater";
import { charIdAtom, lcIdAtom } from "../../_store";

export const CharacterEditorTab = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [charId, updateId] = useAtom(charIdAtom);
  const updateLcId = useSetAtom(lcIdAtom);
  const { data: chara } = useQuery(characterMetadataQ(charId));
  const { data: characterList } = useQuery({
    ...characterMetadatasQ(),
    initialData: { list: [] },
  });
  const [open, setOpen] = useState(false);
  const { filter } = useCharacterFilter();

  const sorted = characterList
    .filter(filter.byElement)
    .filter(filter.byPath)
    .filter(filter.byRarity);

  function onCharacterSelect(to: AvatarConfig) {
    updateId(to.avatar_id);
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
                  key={chara.avatar_id}
                  onSelect={onCharacterSelect}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {chara ? (
          <CharacterCard
            avatar_base_type={chara.avatar_base_type}
            avatar_name={chara.avatar_name}
            className="w-48 p-4"
            damage_type={chara.damage_type}
            imgUrl={url(chara.avatar_id)}
            rarity={chara.rarity}
          />
        ) : null}

        {chara?.avatar_name}
      </div>

      {charId ? (
        <Suspense fallback={<div>loading state..</div>}>
          <CharacterUpdater />
        </Suspense>
      ) : null}

      {chara ? <TraceTableUpdater path={chara.avatar_base_type} /> : null}
    </div>
  );
});
CharacterEditorTab.displayName = "CharacterEditorTab";

interface ItemProps {
  chara: AvatarConfig;
  onSelect: (to: AvatarConfig) => void;
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
        alt={chara.avatar_name}
        height={64}
        src={avatarUrl(chara.avatar_id)}
        width={64}
      />
      <span className="grow justify-self-center">{chara.avatar_name}</span>
    </Toggle>
  );
}

function avatarUrl(id: number) {
  return img(`/icon/avatar/${id}.png`);
}

function url(id: string | number): string {
  return img(`image/character_preview/${id}.png`);
}
