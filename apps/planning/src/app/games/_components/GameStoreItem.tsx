import type { PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";
import { Button, Toggle } from "ui/primitive";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import type { GameSchema } from "../_schema/form";
import { NewGameForm, useNewGameForm } from "./NewGameForm";

interface Prop {
  atom: PrimitiveAtom<GameSchema>;
}
export function GameStoreItem({ atom }: Prop) {
  const [data, setData] = useAtom(atom);
  const [editMode, setEditMode] = useState(false);
  const { form } = useNewGameForm({ defaultValues: data });

  function onSave(values: GameSchema) {
    setData(values);
  }

  return (
    <div className="flex justify-between">
      <NewGameForm disabled={!editMode} form={form} />

      <div className="flex justify-center gap-4">
        {editMode ? (
          <Button
            onClick={() => {
              onSave(form.getValues());
            }}
            variant="success"
          >
            <Check />
          </Button>
        ) : null}
        <Toggle
          onClick={() => {
            setEditMode(!editMode);
          }}
          pressed={editMode}
          variant="outline"
        >
          Edit
        </Toggle>
        <Button className="p-2" variant="outline">
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
