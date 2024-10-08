"use client";

import { useAtomValue } from "jotai";
import { GroupBySelector } from "./home/_components/GroupBySelector";
import { groupModeAtom } from "./home/_schema/store";

export default function Home() {
  const groupMode = useAtomValue(groupModeAtom);

  return (
    <div className="flex flex-col gap-8">
      {/* filter row ?*/}
      <div className="flex items-center gap-4">
        <b>Group by</b>
        <GroupBySelector />
      </div>

      {/* viewer */}
      <div />
    </div>
  );
}
