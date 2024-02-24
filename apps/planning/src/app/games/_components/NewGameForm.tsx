import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
  Form,
  Button,
} from "ui/primitive";
import {
  GameSchema,
  gameSchema,
  gameSchemaDefaultValues,
} from "../_schema/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLAttributes, forwardRef } from "react";

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

export const NewGameForm = forwardRef<HTMLAttributes<HTMLFormElement>, Prop>(
  function NewGameForm({ disabled, form, ...props }, ref) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "tasks",
    });
    return (
      <Form {...form}>
        <form {...props}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input
                  {...field}
                  autoComplete="off"
                  disabled={disabled}
                  className="w-72"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={() => append({ name: "", type: "" })}>
            Add Task
          </Button>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-8">
              <FormField
                control={form.control}
                name={`tasks.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      disabled={disabled}
                      className="w-72"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
          ))}
        </form>
      </Form>
    );
  }
);
