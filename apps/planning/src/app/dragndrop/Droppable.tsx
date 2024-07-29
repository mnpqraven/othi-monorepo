"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

export function Droppable({ children }: { children: ReactNode }) {
  // NOTE: pass ref to dragging element
  const { isOver, setNodeRef } = useDroppable({
    // NOTE: needs unique
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
