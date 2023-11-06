import { BannerType } from "protocol/ts";
import * as z from "zod";

export const schema = z.object({
  currentEidolon: z.number(),
  pity: z.number().max(89, { message: "Pity count must be less than 90" }),
  pulls: z.number(),
  nextGuaranteed: z.boolean(),
  enpitomizedPity: z.number().optional(),
  banner: z.nativeEnum(BannerType),
});
