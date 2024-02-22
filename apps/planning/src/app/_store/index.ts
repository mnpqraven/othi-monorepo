import { atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { GameStore } from "../games/_schema/types";

export const gameStoreAtom = atom<GameStore[]>([]);
export const gameStoreSplittedAtom = splitAtom(gameStoreAtom);
