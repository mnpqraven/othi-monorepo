import { PrimitiveAtom, useAtom } from "jotai";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Toggle,
} from "ui/primitive";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewGameSchema } from "../_schema/form";
import { GameStore } from "../_schema/types";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";

interface Prop {
  atom: PrimitiveAtom<GameStore>;
}
export function GameStoreItem({ atom }: Prop) {
  const [data, setData] = useAtom(atom);
  const [editMode, setEditMode] = useState(false);
  const form = useForm<z.TypeOf<typeof addNewGameSchema>>({
    resolver: zodResolver(addNewGameSchema),
    defaultValues: data,
  });

  function onSave() {}

  return (
    <div className="flex justify-between">
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} autoComplete="off" disabled={!editMode} />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex justify-center gap-4">
        {editMode ? (
          <Button variant="success" onClick={() => onSave()}>
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
