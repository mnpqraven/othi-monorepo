import { atomWithStorage } from "jotai/utils";
import { defaultGachaQuery } from "./types";

export const gachaGraphFormAtom = atomWithStorage(
  "gachaForm",
  defaultGachaQuery,
);
