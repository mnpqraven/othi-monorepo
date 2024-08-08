import { atom } from "jotai";
import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().uuid(),
  dayOfMonth: z.number().optional(),
  dayOfWeek: z.number().optional(),
  startTime: z.object({
    hour: z.number(),
    min: z.number(),
  }),
  endTime: z.object({
    hour: z.number(),
    min: z.number(),
  }),
  category: z.object({
    id: z.string().uuid(),
  }),
});

export type Task = z.TypeOf<typeof taskSchema>;

export const taskListAtom = atom<Task[]>([]);
