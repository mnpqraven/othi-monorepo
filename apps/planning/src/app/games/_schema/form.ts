import { z } from "zod";

export type GameSchema = z.TypeOf<typeof gameSchema>;
export type TaskSchema = z.TypeOf<typeof taskSchema>;

export const taskSchema = z.object({
  name: z.string(),
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  weekDay: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]).optional(),
  monthDay: z.number().optional(),
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
  tasks: z
    .array(taskSchema)
    .min(1, { message: "Please add at least one task" }),
});

export const gameSchemaDefaultValues: GameSchema = {
  name: "",
  tasks: [],
};
