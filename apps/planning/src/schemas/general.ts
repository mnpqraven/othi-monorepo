import { v4 } from "uuid";
import { z } from "zod";

export const uuidSchema = z.string().uuid().default(v4);

export const occurrenceSchema = z.enum(["daily", "weekly", "monthly", "once"]);
export type Occurrence = z.TypeOf<typeof occurrenceSchema>;
