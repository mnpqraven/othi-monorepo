import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@planning/store/configs";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import type { TaskSchema } from "../games/_schema/form";
import { taskSchema } from "./_data/schema";

interface Prop {
  category: Category;
}
export function TaskForm({ category }: Prop) {
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: v4(),
      // TODO: start time
    },
  });

  return null;
}
