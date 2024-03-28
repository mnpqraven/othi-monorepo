"use client";

import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { ScrollArea } from "./scroll-area";

interface Prop<T> extends HTMLAttributes<HTMLButtonElement> {
  options: T[];
  labelAccessor: (item: T) => string;
  valueAccessor: (item: T) => string;
  placeholder?: string;
  emptyLabel?: string;
  searchLabel?: string;
  value?: string;
  onValueChange?: (to: string) => void;
  isLoading?: boolean;
}
export const Combobox = forwardRef(ComboboxInner);

function ComboboxInner<T>(
  {
    options,
    labelAccessor,
    valueAccessor,
    className,
    onValueChange,
    value: outerValue,
    defaultValue = "",
    isLoading = false,
    placeholder = "Select...",
    searchLabel = "Search...",
    emptyLabel = "No result found.",
    ...props
  }: Prop<T>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const [open, setOpen] = useState(false);
  const [stateValue, setValue] = useState(defaultValue);

  const value = outerValue ?? stateValue;

  const current = options.find((kvPair) => valueAccessor(kvPair) === value);

  const placeholderLabel = current ? labelAccessor(current) : placeholder;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn("h-full w-full justify-between", className)}
          ref={ref}
          role="combobox"
          variant="outline"
          {...props}
        >
          {placeholderLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput className="h-9" placeholder={searchLabel} />
          <CommandEmpty>{emptyLabel}</CommandEmpty>

          <ScrollArea viewportClassName="max-h-[24rem]">
            <CommandGroup>
              {!isLoading ? (
                options.map((item) => (
                  <CommandItem
                    key={valueAccessor(item)}
                    onSelect={() => {
                      const currentValue = valueAccessor(item);
                      if (onValueChange)
                        onValueChange(
                          currentValue === value ? "" : currentValue,
                        );

                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    value={valueAccessor(item)}
                  >
                    {labelAccessor(item)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === valueAccessor(item)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <div className="py-2 flex gap-2">
                  <Loader2 />
                  <span>Loading...</span>
                </div>
              )}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
