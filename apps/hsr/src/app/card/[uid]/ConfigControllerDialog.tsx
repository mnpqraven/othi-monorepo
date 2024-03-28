"use client";

import { Close } from "@radix-ui/react-dialog";
import { SlidersHorizontal } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ButtonProps } from "ui/primitive";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Form,
  FormInput,
  FormSelect,
  FormSwitch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "lib/utils";
import { configAtom } from "../_store";
import { initialConfig } from "./configReducer";
import type { CardConfig } from "./configReducer";

export function ConfigController() {
  const changeConfig = useSetAtom(configAtom);
  const form = useForm({
    defaultValues: initialConfig,
  });

  function onSubmit(payload: CardConfig) {
    changeConfig({ type: "updateWholeConfig", payload });
  }

  return (
    <Sheet
      onOpenChange={(e) => {
        if (!e) void form.handleSubmit(onSubmit)();
      }}
    >
      <Tooltip>
        <SheetTrigger asChild>
          <TooltipTrigger asChild>
            <ConfigIcon className="px-2" variant="outline" />
          </TooltipTrigger>
        </SheetTrigger>

        <TooltipContent>Configure Card</TooltipContent>
      </Tooltip>

      <ConfigControllerSheet
        form={form}
        onFormSubmit={onSubmit}
        showSubmit={false}
        side="left"
      />
    </Sheet>
  );
}

type ConfigIconProps = ButtonProps;
const ConfigIcon = forwardRef<HTMLButtonElement, ConfigIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button className={cn("", className)} {...props} ref={ref}>
        <SlidersHorizontal />
      </Button>
    );
  },
);
ConfigIcon.displayName = "ConfigIcon";

interface ConfigControllerSheetProps
  extends ComponentPropsWithoutRef<typeof SheetContent> {
  form: UseFormReturn<CardConfig>;
  onFormSubmit: (payload: CardConfig) => void;
  showSubmit?: boolean;
}

export const ConfigControllerSheet = forwardRef<
  ElementRef<typeof SheetContent>,
  ConfigControllerSheetProps
>(({ onFormSubmit, form, showSubmit = true, ...props }, ref) => {
  const verbosityOptions = [
    { value: "none", label: "None" },
    { value: "simple", label: "Simple" },
    { value: "detailed", label: "Detailed" },
  ];
  type Options = (typeof verbosityOptions)[number];

  const { uid, name } = useAtomValue(configAtom);

  useEffect(() => {
    if (uid) form.setValue("uid", uid);
    if (name) form.setValue("name", name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, name]);

  return (
    <SheetContent ref={ref} {...props}>
      <SheetHeader className="mb-4">
        <SheetTitle>Display Setting</SheetTitle>
        <SheetDescription>
          Show or hide various elements in the character card
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="flex flex-col gap-4">
            <FormSwitch<CardConfig>
              label="Show player info"
              name="showPlayerInfo"
            />
            <FormSwitch<CardConfig>
              label="Show Website URL"
              name="showBaseUrl"
            />
            <FormSelect<Options, CardConfig>
              className="w-32"
              label="Hover info"
              labelAccessor={(item) => item.label}
              name="hoverVerbosity"
              options={verbosityOptions}
              orientation="horizontal"
              valueAccessor={(item) => item.value}
            />
            <FormInput<CardConfig>
              className="w-32"
              label="Player Name"
              name="name"
            />
            <FormInput<CardConfig>
              className="w-32"
              label="Player UID"
              name="uid"
            />
          </div>

          {showSubmit ? (
            <SheetFooter className="mt-4">
              <Close asChild>
                <Button type="submit">Save Changes</Button>
              </Close>
            </SheetFooter>
          ) : null}
        </form>
      </Form>
    </SheetContent>
  );
});
ConfigControllerSheet.displayName = "ConfigControllerDialog";
