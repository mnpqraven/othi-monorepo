import { z } from "zod";

export const TaskType = z.enum(["DAILY", "WEEKLY", "MONTHLY"]);
export type TaskType = z.TypeOf<typeof TaskType>;

export enum Weekdays {
  Mon = "mon",
  Tue = "tue",
  Wed = "wed",
  Thu = "thu",
  Fri = "fri",
  Sat = "sat",
  Sun = "sun",
}

export function weekdayLabel(day?: Weekdays) {
  switch (day) {
    case Weekdays.Mon:
      return "Mon";
    case Weekdays.Tue:
      return "Tue";
    case Weekdays.Wed:
      return "Wed";
    case Weekdays.Thu:
      return "Thu";
    case Weekdays.Fri:
      return "Fri";
    case Weekdays.Sat:
      return "Sat";
    case Weekdays.Sun:
      return "Sun";
    default:
      return "";
  }
}
export function WeekdayToInt(day: Weekdays): number {
  switch (day) {
    case Weekdays.Mon:
      return 1;
    case Weekdays.Tue:
      return 2;
    case Weekdays.Wed:
      return 3;
    case Weekdays.Thu:
      return 4;
    case Weekdays.Fri:
      return 5;
    case Weekdays.Sat:
      return 6;
    case Weekdays.Sun:
      return 0;
  }
}

export function ordinalSuffix(day: number) {
  const j = day % 10,
    k = day % 100;
  if (j === 1 && k !== 11) {
    return `${day}st`;
  }
  if (j === 2 && k !== 12) {
    return `${day}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${day}rd`;
  }
  return `${day}th`;
}
