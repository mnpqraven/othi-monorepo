import type { GameSchema, TaskSchema } from "@planning/app/games/_schema/form";
import { useAtomValue, useSetAtom } from "jotai";
import { Badge, Checkbox } from "ui/primitive";
import { useTime } from "@planning/hooks/useTime";
import { modifyTrackerAtom, taskTrackerAtom } from "../_schema/store";

interface Prop {
  gameId: string;
  tasks: TaskSchema[];
  type: "DAILY" | "WEEKLY" | "MONTHLY";
}
export function TaskChecklist({ tasks, type, gameId }: Prop) {
  const updateTask = useSetAtom(modifyTrackerAtom);
  // TODO: use optics to optimize re-rendering
  const storageData = useAtomValue(taskTrackerAtom);
  const { timeById } = useTime();

  const sorted =
    type === "DAILY"
      ? tasks.sort((a, b) => {
          if (a.timeHour === b.timeHour)
            return (a.timeMin ?? 0) - (b.timeMin ?? 0);
          return (a.timeHour ?? 0) - (b.timeHour ?? 0);
        })
      : tasks;

  function onStatusChange(
    checked: boolean | "indeterminate",
    task: GameSchema["tasks"][number],
  ) {
    // if (checked === "indeterminate") return;
    if (checked) {
      updateTask({ type: "ADD", data: { id: task.id, done: true } });
    } else {
      updateTask({ type: "REMOVE", id: task.id });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((task) => (
        <div className="flex items-center gap-2" key={task.name}>
          <Checkbox
            checked={storageData.tasks.find((e) => e.id === task.id)?.done}
            id={task.id}
            onCheckedChange={(checked) => {
              onStatusChange(checked, task);
            }}
          />
          <label className="flex items-center gap-2" htmlFor={task.id}>
            <Badge>{timeById({ taskId: task.id, gameId })}</Badge>
            {task.name}
          </label>
        </div>
      ))}
    </div>
  );
}
