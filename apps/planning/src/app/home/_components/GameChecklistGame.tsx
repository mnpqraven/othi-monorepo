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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3">
        <div className="flex flex-col gap-4">
          <span>
            <b>Daily</b>
          </span>
          <TaskChecklist
            gameId={game.id}
            tasks={game.tasks.filter((e) => e.type === "DAILY")}
            type="DAILY"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span>
            <b>Weekly</b>
          </span>
          <TaskChecklist
            gameId={game.id}
            tasks={game.tasks.filter(({ type }) => type === "WEEKLY")}
            type="WEEKLY"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span>
            <b>Monthly</b>
          </span>
          <TaskChecklist
            gameId={game.id}
            tasks={game.tasks.filter(({ type }) => type === "MONTHLY")}
            type="MONTHLY"
          />
        </div>
      </CardContent>
    </Card>
  );
}
