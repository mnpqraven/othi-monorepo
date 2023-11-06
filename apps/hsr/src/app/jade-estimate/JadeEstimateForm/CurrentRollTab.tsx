import { UseFormReturn } from "react-hook-form";
import { cva } from "class-variance-authority";
import { JadeEstimateCfg } from "protocol/ts";
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

type Props = {
  form: UseFormReturn<JadeEstimateCfg>;
};

const CurrentRollTab = ({ form }: Props) => {
  const { errors } = form.formState;

  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      <Tabs defaultValue="currentRolls" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="currentRolls"
            className={triggerVariant("currentRolls", errors)}
          >
            Sp. Passes
          </TabsTrigger>
          <TabsTrigger
            value="currentJades"
            className={triggerVariant("currentJades", errors)}
          >
            Jades
          </TabsTrigger>
          <TabsTrigger
            value="dailyRefills"
            className={triggerVariant("dailyRefills", errors)}
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
                      type="number"
                      min={0}
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
                      type="number"
                      min={0}
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
                      type="number"
                      min={0}
                      max={8}
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
};

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
