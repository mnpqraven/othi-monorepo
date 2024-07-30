import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["game", "other"]),
});
export type Category = z.TypeOf<typeof categorySchema>;

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
