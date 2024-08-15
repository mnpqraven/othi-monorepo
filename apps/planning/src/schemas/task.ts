import { z } from "zod";
import { categorySchema } from "./category";
import { occurrenceSchema, uuidSchema } from "./general";
import { timeSchema } from "./datetime";

export const taskSchema = z.object({
  taskId: uuidSchema,
  name: z.string().min(1),
  time: z
    .object({
      start: timeSchema,
      end: timeSchema,
    })
    .refine(
      ({ start, end }) => {
        if (start.hour === end.hour && start.min > end.min) return false;
        if (start.hour > end.hour) return false;
        return true;
      },
      { message: "end time must be bigger than start time" },
    ),
  occurrence: occurrenceSchema,
  category: categorySchema.pick({ id: true }),
});

export type Task = z.TypeOf<typeof taskSchema>;
