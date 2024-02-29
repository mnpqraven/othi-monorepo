import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type GroupMode = "GAME" | "TYPE";
export const groupModeAtom = atom<GroupMode>("TYPE");

interface TaskTracker {
  lastUpdated: number; // unix
  tasks: { id: string; done: boolean }[];
}

export const taskTracker = atomWithStorage<TaskTracker>("taskTracker", {
  lastUpdated: new Date().getTime(),
  tasks: [],
});
