"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "ui/primitive";
import { useSetAtom } from "jotai";
import { GameStoreList } from "./_components/GameStoreList";
import type { GameSchema } from "./_schema/form";
import { addGamesAtom } from "./_schema/store";
import { NewGameForm, useNewGameForm } from "./_components/NewGameForm";

export default function Games() {
  const addToList = useSetAtom(addGamesAtom);
  const { form } = useNewGameForm();

  function onSubmit(values: GameSchema) {
    addToList(values);
    form.reset();
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>New Task</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NewGameForm form={form} />
          <Button className="w-fit" onClick={form.handleSubmit(onSubmit)}>
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <GameStoreList />
        </CardContent>
      </Card>
    </div>
  );
}
