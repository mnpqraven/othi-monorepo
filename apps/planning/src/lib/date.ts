import { range } from "lib";
import { subDays } from "date-fns";
import type { z } from "zod";
import type { timeSchema } from "@planning/schemas/datetime";

/**
 * @param month - 1-based index of the month, january is 0
 *
 * @param year - current year
 */
export function daysInMonth(month: number, year: number) {
  const isLeap = year % 4 === 0;
  switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
    case 1:
      return isLeap ? 28 : 27;
    default:
      return 30;
  }
}

/**
 * calculates the date for a calendar table
 * @param date - the date the calendar is around, if undefined then the
 * current date is chosen
 * @param expand - whether the array should be expanded to fill the calendar
 * table
 */
export function dayConfigsInMonth(
  date?: Date,
): (Record<"weekDay" | "day" | "month" | "year", number> & { date: Date })[] {
  const currentDate = date ?? new Date();

  const firstDayOfMonth = new Date(currentDate);
  firstDayOfMonth.setDate(1);

  return Array.from(range(1, 35)).map((index) => {
    const diff = currentDate.getDate() - index;
    const next = subDays(currentDate, diff);
    return {
      date: next,
      day: next.getDate(),
      weekDay: next.getDay(),
      month: next.getMonth(),
      year: next.getFullYear(),
    };
  });
}

export const dayCols = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

/** parses a HH:MM format to object
 * */
export function parseSimpleTime(
  dateString: string,
): z.TypeOf<typeof timeSchema> {
  // throw on multiple or no colon
  const colonCount = (dateString.match(/:/g) || []).length;
  if (colonCount !== 1)
    throw Error(`invalid short date string: ${dateString} is not HH:mm`);
  const colonI = dateString.indexOf(":");

  const hour = Number(dateString.substring(0, colonI));
  const min = Number(dateString.substring(colonI + 1, dateString.length));
  return {
    hour,
    min,
    label: dateString,
    index: hour * 2 + (min % 30),
  };
}
