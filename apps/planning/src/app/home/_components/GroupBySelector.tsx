"use client";

import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/primitive";
import type { GroupMode } from "../_schema/store";
import { groupModeAtom } from "../_schema/store";

export function GroupBySelector() {
  const [groupMode, setGroupMode] = useAtom(groupModeAtom);
  return (
    <Select
      onValueChange={(e: GroupMode) => {
        setGroupMode(e);
      }}
      value={groupMode}
    >
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="TYPE" value="TYPE">
          Type
        </SelectItem>
        <SelectItem key="GAME" value="GAME">
          Game
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
