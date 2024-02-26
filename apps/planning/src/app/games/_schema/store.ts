import { atom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import type { GameSchema } from "./form";

// NOTE: types in types.ts need to be conformed with form in form.ts
export const gamesAtom = atomWithStorage<GameSchema[]>("gameList", []);

export const addGamesAtom = atom(null, (get, set, update: GameSchema) => {
  set(gamesAtom, [...get(gamesAtom), update]);
});

export const deleteGamesAtom = atom(null, (get, set, update: number) => {
  set(
    gamesAtom,
    get(gamesAtom).filter((_e, index) => index !== update),
  );
});

export const gamesSplittedAtom = splitAtom(gamesAtom);
