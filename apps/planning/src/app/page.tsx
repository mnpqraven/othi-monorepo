"use client";

import { useAtomValue } from "jotai";
import { GroupBySelector } from "./home/_components/GroupBySelector";
import { groupModeAtom, taskTrackerAtom } from "./home/_schema/store";
import { GameChecklistGame } from "./home/_components/GameChecklistGame";
import { GameChecklistType } from "./home/_components/GameChecklistType";

export default function Home() {
  const groupMode = useAtomValue(groupModeAtom);
  const storageData = useAtomValue(taskTrackerAtom);

  return (
    <div className="flex flex-col gap-8">
      {/* filter row ?*/}
      <div className="flex items-center gap-4">
        <b>Group by</b>
        <GroupBySelector />
      </div>

      {/* viewer */}
      {groupMode === "GAME" ? <GameChecklistGame /> : <GameChecklistType />}
      <div />

      <div>
        storage data:
        <pre suppressHydrationWarning>
          {JSON.stringify(storageData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
