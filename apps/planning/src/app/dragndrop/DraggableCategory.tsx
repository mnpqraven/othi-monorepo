import { useDraggable } from "@dnd-kit/core";
import type { Category } from "@planning/store/configs";
import { Badge, badgeVariants } from "ui/primitive";
import type { Transform } from "@dnd-kit/utilities";

interface Prop {
  data: Category;
}
export function DraggableCategory({ data }: Prop) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `category-${data.name}`,
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
  return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
}
