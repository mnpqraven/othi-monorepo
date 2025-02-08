import { z } from "zod";

export const Z_BOOLEAN = z
  .string()
  // transform to boolean using preferred coercion logic
  .transform((s) => s !== "false" && s !== "0");

export const Z_ONLY_BOOLEAN = z
  .string()
  // only allow "true" or "false"
  .refine((s) => s === "true" || s === "false")
  // transform to boolean
  .transform((s) => s === "true");
