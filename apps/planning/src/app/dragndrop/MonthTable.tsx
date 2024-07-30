/* eslint-disable react/no-array-index-key */
import { dayCols, dayConfigsInMonth } from "@planning/lib/date";
import { chunks, cn } from "lib/utils";
import { isSameDay, isSameMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";

export function MonthTable() {
  const currentDate = new Date();

  const dates = dayConfigsInMonth(currentDate);

  const datesByRows = Array.from(chunks(dates, 7));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {dayCols.map((day) => (
            <TableHead className="border" key={day.value}>
              {day.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {datesByRows.map((daysInRow, rowI) => (
          <TableRow key={rowI}>
            {daysInRow.map((day) => (
              <TableCell className="border" key={day.date.getTime()}>
                <Tooltip>
                  <TooltipTrigger
                    className={cn(
                      isSameDay(currentDate, day.date) ? "font-bold" : "",
                      isSameMonth(currentDate, day.date) ? "" : "italic",
                    )}
                  >
                    {day.day}
                  </TooltipTrigger>
                  <TooltipContent>{JSON.stringify(day)}</TooltipContent>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
