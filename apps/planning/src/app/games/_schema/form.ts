import { z } from "zod";

export type GameSchema = z.TypeOf<typeof gameSchema>;
export type TaskSchema = z.TypeOf<typeof taskSchema>;

export const taskSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const gameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  tasks: z.array(taskSchema),
});

export const gameSchemaDefaultValues: GameSchema = {
  name: "",
  tasks: [],
};
