import { atomWithReset } from "jotai/utils";
import { focusAtom } from "jotai-optics";

export const commandAtom = atomWithReset({
  openState: false,
  searchInput: "",
});

export const commandOpenAtom = focusAtom(commandAtom, (optic) =>
  optic.prop("openState"),
);

export const commandSearchInputAtom = focusAtom(commandAtom, (optic) =>
  optic.prop("searchInput"),
);
