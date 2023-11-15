import { z } from "zod";

export const Pagination = z.object({
  pageIndex: z.number().default(0),
  pageCount: z.number().default(10),
});

export const CharId = z.object({
  charId: z.number(),
});

export const LcId = z.object({
  lcId: z.number(),
});
