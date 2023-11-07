import type { PlainMessage } from "@bufbuild/protobuf";
import type { ProbabilityRatePayload } from "protocol/ts";
import { BannerType } from "protocol/ts";

export const defaultGachaQuery: PlainMessage<ProbabilityRatePayload> = {
  currentEidolon: -1,
  pity: 0,
  pulls: 0,
  nextGuaranteed: false,
  enpitomizedPity: undefined,
  banner: BannerType.SSR,
};
