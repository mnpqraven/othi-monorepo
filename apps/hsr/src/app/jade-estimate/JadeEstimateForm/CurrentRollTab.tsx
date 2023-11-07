import type { UseFormReturn } from "react-hook-form";
import { cva } from "class-variance-authority";
import type { JadeEstimateCfg } from "protocol/ts";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "ui/primitive";

interface Props {
  form: UseFormReturn<JadeEstimateCfg>;
}

function CurrentRollTab({ form }: Props) {
  const { errors } = form.formState;

  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      <Tabs className="w-full" defaultValue="currentRolls">
        <TabsList className="w-full">
          <TabsTrigger
            className={triggerVariant("currentRolls", errors)}
            value="currentRolls"
          >
            Sp. Passes
          </TabsTrigger>
          <TabsTrigger
            className={triggerVariant("currentJades", errors)}
            value="currentJades"
          >
            Jades
          </TabsTrigger>
          <TabsTrigger
            className={triggerVariant("dailyRefills", errors)}
            value="dailyRefills"
          >
            Daily Refills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="currentRolls">
          <FormField
            control={form.control}
            name="currentRolls"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Current passes</FormLabel>
                    <FormDescription>
                      Amount of special passes you currently possess
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      className="w-20"
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="currentJades">
          <FormField
            control={form.control}
            name="currentJades"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Current jades</FormLabel>
                    <FormDescription>
                      Amount of jades you currently possess
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      className="w-20"
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="dailyRefills">
          <FormField
            control={form.control}
            name="dailyRefills"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Daily Refills</FormLabel>
                    <FormDescription>
                      Amount of refills (using Jades) everyday
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      className="w-20"
                      max={8}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { CurrentRollTab };

function triggerVariant(key: string, errors: object) {
  const variant = cva("w-full", {
    variants: {
      variant: {
        default: "",
        error: "text-destructive data-[state=active]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });
  return variant({ variant: key in errors ? "error" : "default" });
}
