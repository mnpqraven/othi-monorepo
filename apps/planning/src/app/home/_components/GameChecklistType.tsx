import { gamesAtom } from "@planning/app/games/_schema/store";
import { useAtomValue } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "ui/primitive";
import type { TaskSchema } from "@planning/app/games/_schema/form";
import { TaskChecklist } from "./TaskChecklist";

export function GameChecklistType() {
  const games = useAtomValue(gamesAtom);
  const tasks = games
    .map((e) => e.tasks.map((f) => ({ gameName: e.name, ...f })))
    .flat();

  interface ChecklistBlock {
    label: string;
    type: "DAILY" | "WEEKLY" | "MONTHLY";
    tasks: (TaskSchema & { gameName: string })[];
  }
  const types: ChecklistBlock[] = [
    {
      label: "Daily",
      type: "DAILY",
      tasks: tasks.filter((e) => e.type === "DAILY"),
    },
    {
      label: "Weekly",
      type: "WEEKLY",
      tasks: tasks.filter((e) => e.type === "WEEKLY"),
    },
    {
      label: "Monthly",
      type: "MONTHLY",
      tasks: tasks.filter((e) => e.type === "MONTHLY"),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {types.map(({ label, tasks, type }) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskChecklist showGameDetail tasks={tasks} type={type} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
