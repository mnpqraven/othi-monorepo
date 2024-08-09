import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, Task, toTimeSchema } from "@planning/store/configs";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { taskSchema } from "@planning/store/configs";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/primitive";
import type { z } from "zod";
import { range } from "lib";

interface Prop {
  category: Category;
  startTime: z.TypeOf<typeof toTimeSchema>;
}
export function TaskForm({ category, startTime }: Prop) {
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskId: v4(),
      name: "",
      occurrence: "once",
      category: { id: category.id },
      time: {
        start: startTime,
      },
    },
  });

  function onSubmit(values: Task) {
    // eslint-disable-next-line no-console
    console.log("values", values);
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeating</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["once", "daily", "weekly", "monthly"].map((ttype) => (
                      <SelectItem key={ttype} value={ttype}>
                        {ttype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="time.start.hour"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Hour</FormLabel>
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(e) => {
                      field.onChange(Number(e));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Array.from(range(0, 23)).map((hr) => (
                        <SelectItem key={hr} value={hr.toString()}>
                          {hr.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time.start.min"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Min</FormLabel>
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(e) => {
                      field.onChange(Number(e));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {[0, 30].map((hr) => (
                        <SelectItem key={hr} value={hr.toString()}>
                          {hr.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="time.end.hour"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Hour</FormLabel>
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(e) => {
                      field.onChange(Number(e));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Array.from(range(1, 24)).map((hr) => (
                        <SelectItem key={hr} value={hr.toString()}>
                          {hr.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time.end.min"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Min</FormLabel>
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(e) => {
                      field.onChange(Number(e));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {[0, 30].map((hr) => (
                        <SelectItem key={hr} value={hr.toString()}>
                          {hr.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" type="button" variant="outline">
              Cancel
            </Button>
            <Button className="flex-1" type="submit">
              submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
