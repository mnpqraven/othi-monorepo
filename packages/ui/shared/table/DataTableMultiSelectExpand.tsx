import type { Table } from "@tanstack/react-table";
import { cn } from "lib/utils";
import { Check, Command } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../primitive";

interface Prop<TData, TFilter extends string>
  extends ComponentPropsWithoutRef<typeof Button> {
  table: Table<TData>;
  options: TFilter[];
  columnKey: keyof TData;
  placeholder?: string;
}

export function DataTableMultiSelectExpand<TData, TFilter extends string>({
  table,
  options,
  columnKey,
  placeholder,
  ...props
}: Prop<TData, TFilter>) {
  // removes duplications
  const selectedEvents = table.getIsSomePageRowsSelected();
  const { rows } = table.getRowModel();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...props}>{placeholder}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput className="border-none" placeholder="Enter event" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const rowsWithEventName = rows.filter(
                  (row) => row.getValue(columnKey as string) === option,
                );

                const isSelected = rowsWithEventName.every((row) =>
                  row.getIsSelected(),
                );

                return (
                  <CommandItem
                    key={option as string}
                    onSelect={() => {
                      // probably will need to pass this filterFn as props for
                      // more complex selectors
                      const filtered = rows.filter(
                        (row) => row.getValue(columnKey as string) === option,
                      );
                      if (filtered.every((row) => row.getIsSelected())) {
                        filtered.forEach((row) => {
                          row.toggleSelected(false);
                        });
                      } else
                        filtered.forEach((row) => {
                          row.toggleSelected(true);
                        });
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {/* {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
                    <span>{option}</span>
                    {/* {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )} */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedEvents ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => {
                      table.toggleAllPageRowsSelected(false);
                    }}
                  >
                    Clear selection
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
