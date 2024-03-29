import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type GroupMode = "GAME" | "TYPE";
export const groupModeAtom = atom<GroupMode>("TYPE");
groupModeAtom.debugLabel = "groupModeAtom";

interface Task {
  id: string;
  done?: boolean;
}
interface TaskTracker {
  lastUpdated: number; // unix
  tasks: Task[];
}

export const taskTrackerAtom = atomWithStorage<TaskTracker>("taskTracker", {
  lastUpdated: new Date().getTime(),
  tasks: [],
});
taskTrackerAtom.debugLabel = "taskTrackerAtom";

type ModifyReducer =
  | { type: "ADD"; data: Task }
  | { type: "REMOVE"; id: string };
export const modifyTrackerAtom = atom(
  null,
  (get, set, payload: ModifyReducer) => {
    const current = get(taskTrackerAtom);
    if (payload.type === "ADD") {
      const { data } = payload;
      const nextTask = current.tasks.map((e) => (e.id === data.id ? data : e));
      if (!current.tasks.find(({ id }) => id === data.id)) {
        nextTask.push(payload.data);
      }
      set(taskTrackerAtom, {
        ...current,
        lastUpdated: new Date().getTime(),
        tasks: nextTask,
      });
    } else {
      // NOTE: remove
      const { id } = payload;
      const nextTasks = get(taskTrackerAtom).tasks.filter(
        (task) => task.id !== id,
      );
      set(taskTrackerAtom, {
        ...current,
        lastUpdated: new Date().getTime(),
        tasks: nextTasks,
      });
    }
  },
);
