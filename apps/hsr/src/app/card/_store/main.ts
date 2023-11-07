import { atom } from "jotai";
import type {
  ParsedRelicSchema,
  StatParserConstructor,
} from "@hsr/hooks/useStatParser";
import {
  atomWithReducer,
  atomWithStorage,
  selectAtom,
  splitAtom,
} from "jotai/utils";
import type {
  CardConfig,
  CardConfigAction} from "../[uid]/configReducer";
import {
  configReducer,
  initialConfig,
} from "../[uid]/configReducer";
import type { MihomoPlayer } from "../types";
import {
  charIdAtom,
  charLevelAtom,
  charPromotionAtom,
  charStructAtom,
  charTraceAtom,
} from "./character";
import { relicsStructAtom } from "./relic";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
  lcStructAtom,
} from "./lightcone";

export const configAtom = atomWithReducer<CardConfig, CardConfigAction>(
  initialConfig,
  configReducer
);

export const hoverVerbosityAtom = selectAtom(
  configAtom,
  (atom) => atom.hoverVerbosity
);

export const armoryStructAtom = atom((get) => ({
  player: get(charStructAtom),
  relic: get(relicsStructAtom),
  lc: get(lcStructAtom),
}));

export const statParseParam = atom<StatParserConstructor | undefined>((get) => {
  const charId = get(charIdAtom);
  const lcId = get(lcIdAtom);
  const relic = get(relicsStructAtom).filter((e) => Boolean(e.property) && e.setId);
  if (!charId || !lcId) return undefined;
  return {
    character: {
      level: get(charLevelAtom),
      id: charId,
      ascension: get(charPromotionAtom),
    },
    traceTable: get(charTraceAtom),
    lightCone: {
      id: lcId,
      level: get(lcLevelAtom),
      ascension: get(lcPromotionAtom),
      imposition: get(lcImpositionAtom) - 1,
    },
    relic: relic as ParsedRelicSchema[],
  };
});

export const cachedProfilesAtom = atomWithStorage<MihomoPlayer[]>(
  "playerProfiles",
  []
);
export const cachedProfileAtoms = splitAtom(cachedProfilesAtom);
