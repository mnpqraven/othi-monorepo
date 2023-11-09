import type { DottedPaths } from "lib/generics";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import { Switch } from "../switch";

export interface FormSwitchProps<TForm extends object>
  extends Omit<ComponentPropsWithoutRef<typeof FormField>, "render"> {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  label?: string | ReactNode;
}

export function FormSwitch<TForm extends object>({
  name,
  label,
  ...props
}: FormSwitchProps<TForm>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between space-x-2">
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
        </FormItem>
      )}
      {...props}
    />
  );
}
