import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva } from "class-variance-authority";
import type { DottedPaths } from "lib/generics";
import { cn } from "lib";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export interface FormSelectProps<TOptions, TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  options: TOptions[];
  valueAccessor: (value: TOptions) => string;
  labelAccessor: ((value: TOptions) => ReactNode) | ReactNode;
  orientation?: "horizontal" | "vertical";
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export function FormSelect<TOptions, TForm extends object>({
  name,
  label,
  options,
  labelAccessor,
  valueAccessor,
  className,
  orientation = "vertical",
  wrapperClassName,
  ...props
}: FormSelectProps<TOptions, TForm>) {
  const wrapperVariant = cva("", {
    variants: {
      orientation: {
        horizontal: "flex flex-row items-center justify-between space-x-2",
        vertical: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  });
  return (
    <FormField
      name={name as string}
      render={({ field }) => (
        <FormItem
          className={cn(wrapperVariant({ orientation }), wrapperClassName)}
        >
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue />
              </SelectTrigger>
            </FormControl>

            <SelectContent position="popper">
              {options.map((item) => (
                <SelectItem
                  key={valueAccessor(item)}
                  value={valueAccessor(item)}
                >
                  {typeof labelAccessor === "function"
                    ? labelAccessor(item)
                    : labelAccessor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
      {...props}
    />
  );
}
