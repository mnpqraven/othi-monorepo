import type { TaskSchema } from "@planning/app/games/_schema/form";
import { useTime } from "@planning/hooks/useTime";
import type { ComponentPropsWithoutRef } from "react";
import { Badge } from "ui/primitive";

interface TimerBadgeProp extends ComponentPropsWithoutRef<typeof Badge> {
  task: TaskSchema;
}
export function TimerBadge({ task, ...props }: TimerBadgeProp) {
  const { timeById } = useTime();
  const amount = timeById({ taskId: task.id });

  if (!amount) return null;

  return <Badge {...props}>{amount}</Badge>;
}
