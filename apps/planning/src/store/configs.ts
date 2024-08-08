import { parseSimpleTime } from "@planning/lib/date";
import { atomWithStorage } from "jotai/utils";
import { v4 } from "uuid";
import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const timeSchema = z.object({
  hour: z.number(),
  min: z.number(),
  label: z.string().length(5).optional(),
  index: z.number().optional(),
});

export const toTimeSchema = z.string().transform(parseSimpleTime);

export const categorySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1, "Name is required"),
  type: z.enum(["game", "other"]),
});
export type Category = z.TypeOf<typeof categorySchema>;

export const defaultCategory = (): Category => ({
  id: v4(),
  name: "",
  type: "game",
});

export const categoriesAtom = atomWithStorage<Category[]>("categories", []);

type CategoryReducerAction =
  | { type: "add"; payload: Category }
  | { type: "remove"; payload: { id: number } };

export function categoryReducer(
  prev: Category[],
  action: CategoryReducerAction,
) {
  switch (action.type) {
    case "add":
      return [...prev, action.payload];
    case "remove":
      return prev.filter((_, index) => index !== action.payload.id);
    default:
      throw new Error("unknown action type");
  }
}

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
    start: timeSchema,
    end: timeSchema,
  }),
  occurrence: occurrenceSchema,
  category: categorySchema.pick({ id: true }),
});

export type Task = z.TypeOf<typeof taskSchema>;
