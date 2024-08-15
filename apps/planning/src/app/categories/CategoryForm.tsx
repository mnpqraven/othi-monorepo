import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useReducerAtom } from "@planning/hooks/useReducerAtom";
import type { Category } from "@planning/schemas/category";
import {
  categoriesAtom,
  categoryReducer,
  categorySchema,
  defaultCategory,
} from "@planning/schemas/category";

export function CategoryForm() {
  const form = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultCategory(),
  });

  const [_, dispatch] = useReducerAtom(categoriesAtom, categoryReducer);
  function onSubmit(payload: Category) {
    dispatch({ type: "add", payload });
    form.reset(defaultCategory());
  }

  return (
    <Form {...form}>
      <form
        className="flex items-end gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" className="w-72" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["game", "other"].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-fit" type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
}
