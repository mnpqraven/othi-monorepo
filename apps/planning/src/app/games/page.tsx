"use client";

import { Button } from "ui/primitive";
import { useSetAtom } from "jotai";
import { GameStoreList } from "./_components/GameStoreList";
import { GameSchema } from "./_schema/form";
import { addGamesAtom } from "./_schema/store";
import { NewGameForm, useNewGameForm } from "./_components/NewGameForm";

export default function Games() {
  const addToList = useSetAtom(addGamesAtom);
  const { form } = useNewGameForm();

  function onSubmit(values: GameSchema) {
    addToList(values);
  }

  return (
    <div>
      <NewGameForm form={form} />
      <Button onClick={form.handleSubmit(onSubmit)}>Add</Button>

      <GameStoreList />
    </div>
  );
}
