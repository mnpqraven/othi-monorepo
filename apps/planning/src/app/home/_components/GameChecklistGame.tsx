import type { GameSchema } from "@planning/app/games/_schema/form";
import { gamesAtom } from "@planning/app/games/_schema/store";
import { useAtomValue } from "jotai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
} from "ui/primitive";

export function GameChecklistGame() {
  const games = useAtomValue(gamesAtom);
  return (
    <div className="flex flex-col gap-8">
      {games.map((game, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <GameChecklistGameSingular game={game} key={index} />
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
      <CardContent className="flex flex-col gap-2">
        {game.tasks.map((task) => (
          <div className="flex gap-2" key={task.name}>
            <Checkbox />
            {task.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
