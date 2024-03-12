import type { GameSchema, TaskSchema } from "@planning/app/games/_schema/form";
import { useAtomValue, useSetAtom } from "jotai";
import { Badge, Checkbox } from "ui/primitive";
import { ordinalSuffix, weekdayLabel } from "@planning/app/games/_schema/types";
import { cn } from "lib";
import { modifyTrackerAtom, taskTrackerAtom } from "../_schema/store";
import { TimerBadge } from "./TimerBadge";

interface Prop {
  tasks: (TaskSchema & { gameName?: string })[];
  showGameDetail?: boolean;
}
export function TaskChecklist({ tasks, showGameDetail = false }: Prop) {
  const updateTask = useSetAtom(modifyTrackerAtom);
  // TODO: use optics to optimize re-rendering
  const storageData = useAtomValue(taskTrackerAtom);

  const sorted = tasks.sort((a, b) => {
    if (a.timeHour === b.timeHour) return (a.timeMin ?? 0) - (b.timeMin ?? 0);
    return (a.timeHour ?? 0) - (b.timeHour ?? 0);
  });

  function onStatusChange(
    checked: boolean | "indeterminate",
    task: GameSchema["tasks"][number],
  ) {
    if (checked) {
      updateTask({ type: "ADD", data: { id: task.id } });
    } else {
      updateTask({ type: "REMOVE", id: task.id });
    }
  }

  const findTask = (task: TaskSchema) =>
    storageData.tasks.find((e) => e.id === task.id);

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((task) => (
        <div className="flex justify-between" key={task.name}>
          <div className={cn("flex items-center gap-2")}>
            <Checkbox
              checked={Boolean(findTask(task))}
              id={task.id}
              onCheckedChange={(checked) => {
                onStatusChange(checked, task);
              }}
            />
            <label className="flex items-center gap-2" htmlFor={task.id}>
              <TimerBadge task={task} />
              {task.name}
            </label>
          </div>

          <div className="flex items-center gap-2">
            {task.type === "WEEKLY" ? (
              <Badge variant="outline">{weekdayLabel(task.weekDay)}</Badge>
            ) : null}

            {task.type === "MONTHLY" && task.monthDay ? (
              <Badge variant="outline">{ordinalSuffix(task.monthDay)}</Badge>
            ) : null}

            {showGameDetail ? (
              <Badge variant="outline">{task.gameName}</Badge>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
