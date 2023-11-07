import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/primitive";
import type { Property } from "@hsr/bindings/RelicSubAffixConfig";
import { propertyIconUrl, propertyName } from "@hsr/lib/propertyHelper";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import Svg from "react-inlinesvg";

interface Prop extends ComponentPropsWithoutRef<typeof SelectContent> {
  options: Property[];
  onValueChange: (value: Property) => void;
  itemDisabled?: (prop: Property) => boolean;
  defaultValue?: string;
  value?: string;
}

export const PropertySelect = forwardRef<HTMLDivElement, Prop>(
  (
    {
      onValueChange,
      options,
      className,
      itemDisabled,
      defaultValue,
      value,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <Select
        defaultValue={defaultValue}
        onValueChange={(e) => {
          onValueChange(e as Property);
        }}
        value={value ?? ""}
      >
        <SelectTrigger className={className} id={id}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent {...props} ref={ref}>
          {options.map((option) => (
            <SelectItem
              disabled={!itemDisabled ? false : itemDisabled(option)}
              key={option}
              value={option}
            >
              <div className="flex items-center gap-2">
                <Svg height={24} src={propertyIconUrl(option)} width={24} />

                <span>{propertyName(option)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);
PropertySelect.displayName = "PropertySelect ";
