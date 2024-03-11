import type { GameSchema } from "@planning/app/games/_schema/form";
import { gamesAtom } from "@planning/app/games/_schema/store";
import { useAtomValue } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "ui/primitive";
import { TaskChecklist } from "./TaskChecklist";

export function GameChecklistGame() {
  const games = useAtomValue(gamesAtom);
  return (
    <div className="flex flex-col gap-8">
      {games.map((game) => (
        <GameChecklistGameSingular game={game} key={game.id} />
      ))}
    </div>
  );
}

function GameChecklistGameSingular({ game }: { game: GameSchema }) {
  const filterBy = (byType: "DAILY" | "WEEKLY" | "MONTHLY") =>
    game.tasks.filter(({ type }) => type === byType);

  const maps = [
    { label: "Daily", tasks: filterBy("DAILY") },
    { label: "Weekly", tasks: filterBy("WEEKLY") },
    { label: "Monthly", tasks: filterBy("MONTHLY") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {maps.map(({ label, tasks }) => (
          <div className="flex flex-col gap-2" key={label}>
            <span>
              <b>{label}</b>
            </span>
            <TaskChecklist tasks={tasks} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
