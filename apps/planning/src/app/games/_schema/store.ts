import { atom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import type { GameSchema } from "./form";

// NOTE: types in types.ts need to be conformed with form in form.ts
export const gamesAtom = atomWithStorage<GameSchema[]>("gameList", []);

export const wtfAtom = atomWithStorage("wtf", { wtf: "hello" });
export const addGamesAtom = atom(null, (get, set, update: GameSchema) => {
  set(gamesAtom, [...get(gamesAtom), update]);
});

export const gamesSplittedAtom = splitAtom(gamesAtom);
