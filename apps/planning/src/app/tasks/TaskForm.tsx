"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { uuidSchema } from "@planning/schemas/general";
import type { Task } from "@planning/schemas/task";
import { taskSchema } from "@planning/schemas/task";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "ui/primitive";

export function TaskForm() {
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskId: uuidSchema.parse(undefined),
      name: "",
      occurrence: "once",
    },
  });

  function onSubmit(values: Task) {
    //
    //
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
