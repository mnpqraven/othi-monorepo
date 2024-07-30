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
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { MonthTable } from "./MonthTable";
import { WeekTable } from "./WeekTable";
import { useAtomValue } from "jotai";
import { categoriesAtom } from "@planning/store/configs";
import { DraggableCategory } from "./DraggableCategory";

const selects = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

export default function Page() {
  const { toast } = useToast();

  const [viewType, setViewType] = useState("week");
  const categories = useAtomValue(categoriesAtom);

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === "droppable") {
      toast({ description: "drag event" });
    }

    if (event.over && event.active) {
      // TODO: handle drag drop of category here
    }

    console.log("drag event", event);
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext onDragEnd={handleDragEnd}>
        <Draggable>Drag me</Draggable>
        <Droppable>
          <div className="flex h-[300px] w-[300px] items-center justify-center rounded-md border">
            drop zone
          </div>
        </Droppable>

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
