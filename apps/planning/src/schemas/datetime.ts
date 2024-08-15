import { parseSimpleTime } from "@planning/lib/date";
import { z } from "zod";

export const timeSchema = z.object({
  hour: z.number(),
  min: z.number(),
  label: z.string().length(5).optional(),
  index: z.number().optional(),
});

export const toTimeSchema = z.string().transform(parseSimpleTime);

export const shortTimeSchema = z.custom<`${number}-${number}`>((val) => {
  if (typeof val !== "string") return false;
  if (val.length !== 5) return false;
  if (val[2] !== "-") return false;
  const left = Number(val.slice(0, 2));
  const right = Number(val.slice(3));
  return left >= 0 && left <= 24 && right >= 0 && right <= 59;
});
