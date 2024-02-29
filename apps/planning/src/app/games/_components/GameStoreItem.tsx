import type { PrimitiveAtom } from "jotai";
import { useAtom, useSetAtom } from "jotai";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Toggle,
  useToast,
} from "ui/primitive";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import type { GameSchema } from "../_schema/form";
import { deleteGamesAtom } from "../_schema/store";
import { NewGameForm, useNewGameForm } from "./NewGameForm";

interface Prop {
  atom: PrimitiveAtom<GameSchema>;
  index: number;
}
export function GameStoreItem({ atom, index }: Prop) {
  const [data, setData] = useAtom(atom);
  const { toast } = useToast();
  const deleteGame = useSetAtom(deleteGamesAtom);
  const [editMode, setEditMode] = useState(false);
  const { form } = useNewGameForm({ defaultValues: data });

  function onSave(values: GameSchema) {
    setData(values);
    setEditMode(false);
    toast({ title: "Success", description: "Task updated" });
  }

  return (
    <div className="flex justify-between">
      <NewGameForm disabled={!editMode} form={form} />

      <div className="flex justify-center gap-4">
        {editMode ? (
          <Button onClick={form.handleSubmit(onSave)} variant="success">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="p-2" variant="outline">
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  deleteGame(index);
                  toast({ description: "Game deleted", variant: "success" });
                }}
                variant="destructive"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
