import { categorySchema } from "@planning/store/configs";
import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const shortTimeSchema = z.custom<`${number}-${number}`>((val) => {
  if (typeof val !== "string") return false;
  if (val.length !== 5) return false;
  if (val[2] !== "-") return false;
  const left = Number(val.slice(0, 2));
  const right = Number(val.slice(3));
  return left >= 0 && left <= 24 && right >= 0 && right <= 59;
});

export const occurrenceSchema = z.enum(["daily", "weekly", "monthly", "once"]);
export type Occurrence = z.TypeOf<typeof occurrenceSchema>;

export const taskSchema = z.object({
  taskId: uuidSchema,
  name: z.string().min(1),
  time: z.object({
    start: shortTimeSchema,
    end: shortTimeSchema,
  }),
  occurrence: occurrenceSchema,
  category: categorySchema,
});

export type Task = z.TypeOf<typeof taskSchema>;
