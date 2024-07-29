import type {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
  Form,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "ui/primitive";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { v4 } from "uuid";
import type { GameSchema } from "../_schema/form";
import {
  dayOptions,
  frequencyOptions,
  gameSchema,
  gameSchemaDefaultValues,
} from "../_schema/form";

export function useNewGameForm(props?: { defaultValues?: GameSchema }) {
  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: props?.defaultValues ?? gameSchemaDefaultValues,
  });
  return { form };
}

interface Prop extends HTMLAttributes<HTMLFormElement> {
  defaultValues?: GameSchema;
  disabled?: boolean;
  form: UseFormReturn<GameSchema>;
}
export const NewGameForm = forwardRef<HTMLFormElement, Prop>(
  function NewGameForm({ disabled, form, ...props }, ref) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "tasks",
    });
    const errs = (index: number) =>
      form.formState.errors.tasks
        ? form.formState.errors.tasks[index]
        : undefined;

    return (
      <Form {...form}>
        <form {...props} ref={ref}>
          <div className="mb-4 flex items-end gap-4">
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
              disabled={disabled}
              onClick={() => {
                append({
                  name: "",
                  type: "DAILY",
                  id: v4(),
                  timeMin: 0,
                  timeHour: 0,
                });
              }}
              type="button"
              variant="outline"
            >
              Add Task
            </Button>
          </div>

          {fields.map((task, index) => (
            <TaskRow
              control={form.control}
              disabled={disabled}
              errs={errs(index)}
              index={index}
              key={task.id}
              removeFn={remove}
            />
          ))}

          <span className="text-destructive text-sm font-medium">
            {form.formState.errors.tasks?.message}
          </span>
        </form>
      </Form>
    );
  },
);

interface RowProps {
  control: Control<GameSchema>;
  index: number;
  disabled?: boolean;
  errs?: Merge<FieldError, FieldErrorsImpl<GameSchema["tasks"][number]>>;
  removeFn: UseFieldArrayRemove;
}
function TaskRow({
  control,
  index,
  disabled = false,
  errs,
  removeFn,
}: RowProps) {
  const { tasks } = useWatch({ control });
  const currentTask = tasks?.at(index);

  const errMessages = errs
    ? Object.values(errs).map((e: FieldError) => e.message)
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-8">
        <FormField
          control={control}
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

        <FormField
          control={control}
          name={`tasks.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                defaultValue={field.value}
                disabled={disabled}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`tasks.${index}.timeHour`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>HH</FormLabel>
              <Input {...field} className="w-14" disabled={disabled} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`tasks.${index}.timeMin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>MM</FormLabel>
              <Input {...field} className="w-14" disabled={disabled} />
            </FormItem>
          )}
        />

        {currentTask?.type === "WEEKLY" ? (
          <FormField
            control={control}
            name={`tasks.${index}.weekDay`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={disabled}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        ) : null}

        {currentTask?.type === "MONTHLY" ? (
          <FormField
            control={control}
            name={`tasks.${index}.monthDay`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Input
                  {...field}
                  className="w-36"
                  disabled={disabled}
                  max={31}
                  min={0}
                  type="number"
                />
              </FormItem>
            )}
          />
        ) : null}

        {disabled ? null : (
          <Button
            disabled={disabled}
            onClick={() => {
              removeFn(index);
            }}
            type="button"
            variant="destructive"
          >
            Remove
          </Button>
        )}
      </div>

      <div className="text-destructive flex flex-col gap-2">
        {errMessages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </div>
  );
}
