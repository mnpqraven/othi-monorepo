import type { ReactNode } from "react";
import type { DottedPaths } from "lib/generics";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import type { InputProps } from "../input";
import { Input } from "../input";

export interface FormInputProps<TForm extends object> extends InputProps {
  name: DottedPaths<TForm> extends string ? DottedPaths<TForm> : string;
  label?: string | ReactNode;
}
export function FormInput<TForm extends object>({
  name,
  label,
  // onBlur,
  // onChange,
  // value,
  ...props
}: FormInputProps<TForm>) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between space-x-2">
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <Input {...props} {...field} />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}
