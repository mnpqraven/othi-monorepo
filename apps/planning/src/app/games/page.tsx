"use client";

import { useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "ui/primitive";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAtom } from "jotai";
import { gameStoreAtom } from "../_store";
import {
  addNewGameSchema,
  addNewGameSchemaDefaultValues,
} from "./_schema/form";
import { GameStoreList } from "./_components/GameStoreList";

export default function Games() {
  const [list, setList] = useAtom(gameStoreAtom);
  const form = useForm<z.TypeOf<typeof addNewGameSchema>>({
    resolver: zodResolver(addNewGameSchema),
    defaultValues: addNewGameSchemaDefaultValues,
  });

  const t = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  function onSubmit(values: z.TypeOf<typeof addNewGameSchema>) {
    setList([...list, values]);
  }

  // TODO:
  // file refactor
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} autoComplete="off" />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Add</Button>
        </form>
      </Form>

      <GameStoreList />
    </div>
  );
}
