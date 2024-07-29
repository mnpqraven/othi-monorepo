import { useDraggable } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export function Draggable({ children }: { children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  return (
    <button
      ref={setNodeRef}
      style={{
        transform: transformText(transform),
      }}
      {...listeners}
      {...attributes}
      type="button"
    >
      {children}
    </button>
  );
}

function transformText(transform: Transform | undefined | null) {
  if (!transform) return undefined;
  return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
}
