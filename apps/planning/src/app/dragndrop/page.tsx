"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "ui/primitive";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { categoriesAtom } from "@planning/schemas/category";
import { MonthTable } from "./MonthTable";
import { WeekTable } from "./WeekTable";
import { DraggableCategory } from "./DraggableCategory";
import { CategoryDragId } from "./_data/drag";
import { useCreateTaskDialog } from "./useCreateTaskDialog";
import { CategoryDropId } from "./_data/drop";

const selects = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

export default function Page() {
  const { toast } = useToast();
  const { setOpen, updatePreInfo } = useCreateTaskDialog();

  const [viewType, setViewType] = useState("week");
  const categories = useAtomValue(categoriesAtom);

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === "droppable") {
      toast({ description: "drag event" });
    }

    if (event.over) {
      const dragId = new CategoryDragId(event.active.id.toString());
      setOpen(true);
      const dropId = CategoryDropId.fromId(event.over.id.toString());
      if (dropId) {
        const { day, startTime } = dropId;
        updatePreInfo({
          uuid: dragId.uuid,
          startTime,
          day,
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-between">
          <div>Drag a category to a date to start adding a new task</div>

          <Select onValueChange={setViewType} value={viewType}>
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selects.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {categories.map((category) => (
            <DraggableCategory data={category} key={category.name} />
          ))}
        </div>

        {viewType === "week" ? <WeekTable /> : null}
        {viewType === "month" ? <MonthTable /> : null}
      </DndContext>
    </div>
  );
}
