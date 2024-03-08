import { gamesAtom } from "@planning/app/games/_schema/store";
import { useAtomValue } from "jotai";

const ONE_DAY_UNIX = 86400000;

export function useTime() {
  const gamesLib = useAtomValue(gamesAtom);

  function timeById({ taskId, gameId }: { taskId: string; gameId: string }) {
    const task = gamesLib
      .find((e) => e.id === gameId)
      ?.tasks.find((e) => e.id === taskId);

    if (task) {
      const rnUnix = new Date().getTime();
      switch (task.type) {
        case "DAILY":
          return solveTimeDaily(rnUnix, task.timeHour, task.timeMin);
        case "WEEKLY":
          return solveTimeWeekly(rnUnix, task.weekDay);
        case "MONTHLY":
          return solveTimeMonthly(rnUnix, task.monthDay);
      }
    }
    return "1d23h";
  }
  return { timeById };
}

function solveTimeDaily(rnUnix: number, cfgHour?: number, cfgMin?: number) {
  if (cfgHour === undefined || cfgMin === undefined)
    throw new Error("solveTimeDaily throw, contact Othi");

  const nextDate = new Date();
  nextDate.setHours(cfgHour);
  nextDate.setMinutes(cfgMin);
  const nextDateUnix = nextDate.getTime() + ONE_DAY_UNIX;

  return timeDiffToString(rnUnix, nextDateUnix);
}

function solveTimeWeekly(rnUnix: number, cfgWeekday?: string) {
  if (cfgWeekday === undefined)
    throw new Error("solveTimeWeekly throw, contact Othi");
  return "";
}
function solveTimeMonthly(rnUnix: number, cfgMonthday?: number) {
  if (cfgMonthday === undefined)
    throw new Error("solveTimeMonthly throw, contact Othi");
  return "";
}

function timeDiffToString(from: number, to: number): string {
  const diffSecs = (to - from) / 1000;
  const diffMins = diffSecs / 60;
  const diffHours = diffSecs / 3600;
  const diffDays = diffSecs / 86400;
  const diffWeeks = diffSecs / 604800;

  if (diffHours > 1) {
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffHours)}h ${diffMinsRest}m`;
  }
  if (diffDays > 1) {
    const diffHoursRest = diffHours - Math.floor(diffDays) * 24;
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffDays)}d ${Math.floor(diffHoursRest)}h ${diffMinsRest}m`;
  }
  if (diffWeeks > 1) {
    const diffDaysRest = diffDays - Math.floor(diffWeeks) * 7;
    const diffHoursRest = diffHours - Math.floor(diffDays) * 24;
    const diffMinsRest = diffMins - Math.floor(diffHours) * 60;

    return `${Math.floor(diffWeeks)}w ${Math.floor(diffDaysRest)}d ${Math.floor(diffHoursRest)}h ${diffMinsRest}m`;
  }
  return `${Math.floor(diffMins)}m`;
}
