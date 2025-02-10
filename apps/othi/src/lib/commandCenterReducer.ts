import type { TypePayloadPairMap } from "lib/generics";

export interface CommandAtomShape {
  openState: boolean;
  levelDepth: number;
  levelName: string[];
  searchInput: string;
}

interface CommandAtomAction {
  goLevel: { levelName: string };
  goParent: undefined;
  toggleOpen: boolean | undefined;
}

export const defaultCommandAtom: CommandAtomShape = {
  openState: false,
  levelDepth: 0,
  levelName: [],
  searchInput: "",
};

export function commandCenterReducer(
  prev: CommandAtomShape,
  action: TypePayloadPairMap<CommandAtomAction>,
): CommandAtomShape {
  switch (action.type) {
    case "goLevel": {
      const { levelDepth } = prev;
      const { levelName } = action.payload;
      return {
        ...prev,
        levelName: [...prev.levelName, levelName],
        levelDepth: levelDepth + 1,
        searchInput: "",
      };
    }
    case "goParent": {
      const { levelDepth, ...rest } = prev;

      if (levelDepth === 0) return prev;

      // go to root, removes levelname
      const nextLevelNames = [...prev.levelName];
      nextLevelNames.pop();
      if (levelDepth === 1)
        return { ...rest, levelDepth: levelDepth - 1, levelName: [] };
      return { ...rest, levelDepth: levelDepth - 1, levelName: nextLevelNames };
    }
    case "toggleOpen": {
      const { payload } = action;
      const to = payload === undefined ? !prev.openState : payload;
      if (to) {
        return { ...prev, openState: true };
      }
      return defaultCommandAtom;
    }
    default:
      throw new Error("unknown action type");
  }
}
