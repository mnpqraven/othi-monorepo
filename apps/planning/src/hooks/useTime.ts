import { gamesAtom } from "@planning/app/games/_schema/store";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";
import type { Weekdays } from "@planning/app/games/_schema/types";
import { WeekdayToInt } from "@planning/app/games/_schema/types";
import { useCallback, useEffect, useState } from "react";

const ONE_DAY_UNIX = 86_400_000;
const ONE_MONTH_UNIX = ONE_DAY_UNIX * dayjs().daysInMonth();

interface Prop {
  interval: number;
}
export function useTime(props?: Prop) {
  const gamesLib = useAtomValue(gamesAtom);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, props?.interval ?? 1000);
    return () => {
      clearInterval(timer);
    };
  }, [props?.interval]);

  const timeById = useCallback(
    ({ taskId }: { taskId: string }) => {
      const task = gamesLib
        .flatMap((e) => e.tasks)
        .find((e) => e.id === taskId);

      if (task) {
        // const rnUnix = new Date().getTime();
        const rnUnix = currentTime;
        const { timeMin, timeHour, weekDay, monthDay } = task;
        switch (task.type) {
          case "DAILY":
            return solveTimeDaily(rnUnix, timeHour, timeMin);
          case "WEEKLY":
            return solveTimeWeekly(rnUnix, weekDay, timeHour, timeMin);
          case "MONTHLY":
            return solveTimeMonthly(rnUnix, monthDay, timeHour, timeMin);
        }
      }
    },
    [currentTime, gamesLib],
  );
  return { timeById };
}

function solveTimeDaily(rnUnix: number, cfgHour?: number, cfgMin?: number) {
  if (cfgHour === undefined || cfgMin === undefined)
    throw new Error("solveTimeDaily throw, contact Othi");

  const nextDate = new Date();
  nextDate.setHours(cfgHour);
  nextDate.setMinutes(cfgMin);
  nextDate.setSeconds(0);
  const nextDateUnix = nextDate.getTime() + ONE_DAY_UNIX;

  return timeDiffToString(rnUnix, nextDateUnix);
}

function solveTimeWeekly(
  rnUnix: number,
  cfgWeekday: Weekdays | undefined,
  cfgHour: number | undefined,
  cfgMin: number | undefined,
): string | undefined {
  if (cfgWeekday === undefined || cfgHour === undefined || cfgMin === undefined)
    return undefined;
  // throw new Error("solveTimeWeekly throw, contact Othi");

  const nextDate = dayjs()
    .day(WeekdayToInt(cfgWeekday))
    .hour(cfgHour)
    .minute(cfgMin)
    .second(0);
  const nextDateUnix = nextDate.unix() * 1000;

  return timeDiffToString(rnUnix, nextDateUnix);
}
function solveTimeMonthly(
  rnUnix: number,
  cfgMonthday: number | undefined,
  cfgHour: number | undefined,
  cfgMin: number | undefined,
) {
  if (
    cfgMonthday === undefined ||
    cfgHour === undefined ||
    cfgMin === undefined
  )
    throw new Error("solveTimeMonthly throw, contact Othi");

  const nextDate = new Date();
  nextDate.setDate(cfgMonthday);
  nextDate.setHours(cfgHour);
  nextDate.setMinutes(cfgMin);
  nextDate.setSeconds(0);
  const nextDateUnix =
    nextDate.getTime() > rnUnix
      ? nextDate.getTime()
      : nextDate.getTime() + ONE_MONTH_UNIX;

  return timeDiffToString(rnUnix, nextDateUnix);
}

function timeDiffToString(fromUnix: number, toUnix: number): string {
  const diffSecs = (toUnix - fromUnix) / 1000;
  const diffMins = diffSecs / 60;
  const diffHours = diffSecs / 3600;
  const diffDays = diffSecs / 86400;
  const diffWeeks = diffSecs / 604800;

  if (diffWeeks > 1) {
    const diffDaysRest = diffDays - Math.floor(diffWeeks) * 7;
    const diffHoursRest = diffHours - Math.floor(diffDays) * 24;
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffWeeks)}w ${Math.floor(diffDaysRest)}d ${Math.floor(diffHoursRest)}h ${diffMinsRest}m`;
  }
  if (diffDays > 1) {
    const diffHoursRest = diffHours - Math.floor(diffDays) * 24;
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffDays)}d ${Math.floor(diffHoursRest)}h ${Math.floor(diffMinsRest)}m`;
  }
  if (diffHours > 1) {
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffHours)}h ${Math.floor(diffMinsRest)}m`;
  }
  return `${Math.floor(diffMins)}m`;
}
