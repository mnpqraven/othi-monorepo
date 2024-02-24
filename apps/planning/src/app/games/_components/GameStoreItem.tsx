import { PrimitiveAtom, useAtom } from "jotai";
import { Button, Toggle } from "ui/primitive";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { GameSchema } from "../_schema/form";
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
      <NewGameForm form={form} />

      <div className="flex justify-center gap-4">
        {editMode ? (
          <Button variant="success" onClick={() => onSave(form.getValues())}>
            <Check />
          </Button>
        ) : null}
        <Toggle
          variant="outline"
          pressed={editMode}
          onClick={() => setEditMode(!editMode)}
        >
          Edit
        </Toggle>
        <Button variant="outline" className="p-2">
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
