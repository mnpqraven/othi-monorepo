import { atomWithStorage } from "jotai/utils";

export const testAtom = atomWithStorage("testdata", "en");
testAtom.debugLabel = "testAtom";
