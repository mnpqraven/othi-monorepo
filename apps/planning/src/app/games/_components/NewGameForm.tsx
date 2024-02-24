import type { UseFormReturn } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
  Form,
  Button,
} from "ui/primitive";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { gameSchema, gameSchemaDefaultValues } from "../_schema/form";
import type { GameSchema } from "../_schema/form";

interface Prop extends HTMLAttributes<HTMLFormElement> {
  defaultValues?: GameSchema;
  disabled?: boolean;
  form: UseFormReturn<GameSchema>;
}

export function useNewGameForm(props?: { defaultValues?: GameSchema }) {
  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: props?.defaultValues ?? gameSchemaDefaultValues,
  });
  return { form };
}

export const NewGameForm = forwardRef<HTMLFormElement, Prop>(
  function NewGameForm({ disabled, form, ...props }, ref) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "tasks",
    });
    return (
      <Form {...form}>
        <form {...props} ref={ref}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input
                  {...field}
                  autoComplete="off"
                  className="w-72"
                  disabled={disabled}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            onClick={() => {
              append({ name: "", type: "" });
            }}
            type="button"
          >
            Add Task
          </Button>

          {fields.map((field, index) => (
            <div className="flex gap-8" key={field.id}>
              <FormField
                control={form.control}
                name={`tasks.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      className="w-72"
                      disabled={disabled}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => {
                  remove(index);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </form>
      </Form>
    );
  }
);
