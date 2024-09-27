import { atomWithReset } from "jotai/utils";
import { generateUlid } from "lib";

export const editorTempBlogIdAtom = atomWithReset(generateUlid());
