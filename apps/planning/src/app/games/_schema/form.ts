import { v4 } from "uuid";
import { z } from "zod";
import { TaskType, Weekdays } from "./types";

export type GameSchema = z.TypeOf<typeof gameSchema>;
export type TaskSchema = z.TypeOf<typeof taskSchema>;

export const taskSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
  type: TaskType,
  weekDay: z.nativeEnum(Weekdays).optional(),
  monthDay: z.coerce.number().min(0).max(24).optional(),
  timeHour: z.coerce
    .number()
    .min(0, { message: "Hour must be between 0 and 24" })
    .max(24, { message: "Hour must be between 0 and 24" })
    .optional(),
  timeMin: z.coerce
    .number()
    .min(0, { message: "Minute must be between 0 and 59" })
    .max(59, { message: "Minute must be between 0 and 59" })
    .optional(),
});

export const gameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  id: z.string().uuid().default(v4()),
  tasks: z
    .array(taskSchema)
    .min(1, { message: "Please add at least one task" }),
});

export const gameSchemaDefaultValues: GameSchema = {
  name: "",
  id: v4(),
  tasks: [],
};
