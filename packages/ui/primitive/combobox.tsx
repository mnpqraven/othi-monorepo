"use client";

import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { cn } from "lib/utils";

interface Props<T> extends HTMLAttributes<HTMLButtonElement> {
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
  }: Props<T>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const [open, setOpen] = useState(false);
  const [stateValue, setValue] = useState(defaultValue);

  const value = outerValue ?? stateValue;

  const current = options.find((kvPair) => valueAccessor(kvPair) === value);

  const placeholderLabel = !!current ? labelAccessor(current) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("h-full w-full justify-between", className)}
          ref={ref}
          {...props}
        >
          {placeholderLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchLabel} className="h-9" />
          <CommandEmpty>{emptyLabel}</CommandEmpty>

          <ScrollArea viewportClassName="max-h-[24rem]">
            <CommandGroup>
              {!isLoading ? (
                options.map((item) => (
                  <CommandItem
                    key={valueAccessor(item)}
                    value={valueAccessor(item)}
                    onSelect={() => {
                      const currentValue = valueAccessor(item);
                      if (!!onValueChange)
                        onValueChange(
                          currentValue === value ? "" : currentValue
                        );

                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {labelAccessor(item)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === valueAccessor(item)
                          ? "opacity-100"
                          : "opacity-0"
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
