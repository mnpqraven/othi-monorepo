import { focusAtom } from "jotai-optics";
import { useReducerAtom } from "lib/hooks/useReducerAtom";
import { useSetReducerAtom } from "lib/hooks/useSetReducerAtom";
import { atom } from "jotai";
import {
  commandCenterReducer,
  defaultCommandAtom,
  type CommandAtomShape,
} from "./commandCenterReducer";

export const commandAtom = atom<CommandAtomShape>(defaultCommandAtom);

export const useSetCommandReducer = () =>
  useSetReducerAtom(commandAtom, commandCenterReducer);
export const useCommandReducer = () =>
  useReducerAtom(commandAtom, commandCenterReducer);

export const commandSearchInputAtom = focusAtom(commandAtom, (optic) =>
  optic.prop("searchInput"),
);
commandSearchInputAtom.debugLabel = "commandSearchInputAtom";
