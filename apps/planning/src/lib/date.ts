import { range } from "lib";
import { subDays } from "date-fns";

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