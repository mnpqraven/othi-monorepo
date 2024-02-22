import { z } from "zod";

export const taskSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const addNewGameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  tasks: z.array(taskSchema),
});

export const addNewGameSchemaDefaultValues: z.TypeOf<typeof addNewGameSchema> =
  {
    name: "",
    tasks: [],
  };
