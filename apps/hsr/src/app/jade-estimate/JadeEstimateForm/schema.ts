import { BattlePassType, EqTier, Server } from "protocol/ts";
import * as z from "zod";

export const schema = z.object({
  untilDate: z.object({
    day: z.number(),
    month: z.number(),
    year: z.number(),
  }),
  battlePass: z.object({
    battlePassType: z.nativeEnum(BattlePassType),
    currentLevel: z.number().nonnegative(),
  }),
  railPass: z.object({
    useRailPass: z.boolean(),
    daysLeft: z.number().nonnegative(),
  }),
  server: z.nativeEnum(Server),
  eq: z.nativeEnum(EqTier),
  moc: z.number().nonnegative(),
  mocCurrentWeekDone: z.boolean(),
  currentRolls: z.number().nonnegative().optional(),
  currentJades: z.number().nonnegative().optional(),
  dailyRefills: z.number().nonnegative().optional(),
});
