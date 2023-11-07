import type { JadeEstimateCfg } from "protocol/ts";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  Switch,
} from "ui/primitive";

interface Prop {
  form: UseFormReturn<JadeEstimateCfg>;
}
function RailPassField({ form }: Prop) {
  const useRailPass = form.watch("railPass.useRailPass");

  return (
    <div className="rounded-md border p-4">
      <FormField
        control={form.control}
        name="railPass.useRailPass"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <div className="flex-1">
                <FormLabel>Rail Pass</FormLabel>
                <FormDescription>Opt-in</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      {useRailPass ? (
        <>
          <Separator className="my-4" />
          <FormField
            control={form.control}
            name="railPass.daysLeft"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <div className="flex-1">
                    <FormLabel>Days Left</FormLabel>
                    <FormDescription>
                      You&apos;ll receive 300 jades for renewing the
                      subscription
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      {...field}
                      className="w-20"
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </>
      ) : null}
    </div>
  );
}
export { RailPassField };
