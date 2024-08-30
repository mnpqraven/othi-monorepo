import { useDraggable } from "@dnd-kit/core";
import type { Category } from "@planning/schemas/category";
import { Badge } from "ui/primitive";
import type { Transform } from "@dnd-kit/utilities";
import { CategoryDragId } from "./_data/drag";

interface Prop {
  data: Category;
}
export function DraggableCategory({ data }: Prop) {
  const catId = new CategoryDragId(data.id);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: catId.id,
  });

  return (
    <Badge
      ref={setNodeRef}
      style={{
        transform: transformText(transform),
      }}
      {...listeners}
      {...attributes}
    >
      {data.name}
    </Badge>
  );
}
function transformText(transform: Transform | undefined | null) {
  if (!transform) return undefined;
  const { x, y } = transform;
  return `translate3d(${x}px, ${y}px, 0)`;
}
