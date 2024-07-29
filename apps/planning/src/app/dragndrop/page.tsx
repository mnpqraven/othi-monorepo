"use client";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { useToast } from "ui/primitive";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

export default function Page() {
  const { toast } = useToast();

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === "droppable") {
      toast({ description: "drag event" });
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Draggable>Drag me</Draggable>
      <Droppable>
        <div className="flex h-[300px] w-[300px] items-center justify-center rounded-md border">
          drop zone
        </div>
      </Droppable>
    </DndContext>
  );
}
