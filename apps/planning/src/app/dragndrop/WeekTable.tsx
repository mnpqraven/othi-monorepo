/* eslint-disable react/no-array-index-key */
import { useDroppable } from "@dnd-kit/core";
import { dayCols } from "@planning/lib/date";
import { cn, range } from "lib";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/primitive";
import { CategoryDropId } from "./_data/drop";

export function WeekTable() {
  // 48 rows, half an hour per row
  const rows = Array.from(range(0, 47));

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="border">Time</TableHead>

          {dayCols.map((day) => (
            <TableHead className="border" key={day.value}>
              {day.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row) => (
          <TableRow className="border-none hover:bg-transparent" key={row}>
            {row % 2 === 0 ? (
              <TableHead className="border" rowSpan={2}>
                {indexToHour(row)}
              </TableHead>
            ) : null}

            {dayCols.map((day, i) => (
              <DragCell
                day={day}
                first={row % 2 === 0}
                key={`${row}-${i}`}
                time={indexToHour(row)}
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface DragCellProp {
  day: {
    label: string;
    value: number;
  };
  time: string;
  first: boolean;
}

function DragCell({ day, time, first }: DragCellProp) {
  const { value } = day;
  const { isOver, setNodeRef } = useDroppable({
    id: new CategoryDropId({ day: value, time }).id,
  });

  return (
    <TableCell
      className={cn(
        "border-r p-0 transition-colors",
        isOver ? "bg-muted/50" : "",
        first ? "" : "border-b",
      )}
      ref={setNodeRef}
    >
      {/* {day.label} */}
    </TableCell>
  );
}

function indexToHour(index: number) {
  const hour = Math.floor(index / 2);
  const mins = index % 2 === 0 ? 0 : 30;
  const fmtTime = (val: number) => val.toString().padStart(2, "0");
  return `${fmtTime(hour)}:${fmtTime(mins)}`;
}
