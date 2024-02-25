import type {
  Control,
  FieldError,
  FieldErrorsImpl,
  Merge,
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
import { gameSchema, gameSchemaDefaultValues } from "../_schema/form";
import type { GameSchema } from "../_schema/form";

interface Prop extends HTMLAttributes<HTMLFormElement> {
  defaultValues?: GameSchema;
  disabled?: boolean;
  form: UseFormReturn<GameSchema>;
}

interface Option {
  value: string;
  label: string;
}

const frequencyOptions: Option[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];
const dayOptions: Option[] = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

export function useNewGameForm(props?: { defaultValues?: GameSchema }) {
  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: props?.defaultValues ?? gameSchemaDefaultValues,
  });
  return { form };
}

export const NewGameForm = forwardRef<HTMLFormElement, Prop>(
  function NewGameForm({ disabled, form, ...props }, ref) {
    const { fields, append } = useFieldArray({
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
              append({ name: "", type: "DAILY" });
            }}
            type="button"
            variant="outline"
          >
            Add Task
          </Button>

          {fields.map((task, index) => (
            <TaskRow
              control={form.control}
              disabled={disabled}
              errs={errs(index)}
              index={index}
              key={task.id}
            />
          ))}
        </form>
      </Form>
    );
  }
);

interface RowProps {
  control: Control<GameSchema>;
  index: number;
  disabled?: boolean;
  errs?: Merge<FieldError, FieldErrorsImpl<GameSchema["tasks"][number]>>;
}
function TaskRow({ control, index, disabled = false, errs }: RowProps) {
  const { tasks } = useWatch({ control });
  const currentTask = tasks?.at(index);

  const { remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const errMessages = errs
    ? Object.values(errs).map((e: FieldError) => e.message)
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8">
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
                <Input {...field} disabled={disabled} />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={control}
          name={`tasks.${index}.timeHour`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>HH</FormLabel>
              <Input {...field} className="w-12" disabled={disabled} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`tasks.${index}.timeMin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>MM</FormLabel>
              <Input {...field} className="w-12" disabled={disabled} />
            </FormItem>
          )}
        />
        <Button
          disabled={disabled}
          onClick={() => {
            remove(index);
          }}
        >
          Remove
        </Button>
      </div>
      <div className="flex flex-col gap-2 text-destructive">
        {errMessages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </div>
  );
}
