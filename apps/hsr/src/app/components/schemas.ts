import * as z from "zod";

export const dateToISO = z
  .date({ required_error: "dateToISO" })
  .transform((e) => ({
    day: e.getDate(),
    month: e.getMonth() + 1,
    year: e.getUTCFullYear(),
  }));

export const objToDate = z
  .object(
    {
      day: z.number(),
      month: z.number(),
      year: z.number(),
    },
    { required_error: "objToDate" }
  )
  .transform((e) => new Date(e.year, e.month - 1, e.day));
