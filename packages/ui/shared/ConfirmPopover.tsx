import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "../primitive";

interface Prop {
  children: ReactNode;
  noLabel?: string;
  yesLabel?: string;
  variants?: Partial<
    Record<"yes" | "no", ComponentPropsWithoutRef<typeof Button>["variant"]>
  >;
  onConfirm?: () => void;
  text?: Partial<Record<"header" | "description", string>>;
  tooltip?: string | ReactNode;
  asChild?: boolean;
}
export function ConfirmPopover(props: Prop) {
  const { noLabel = "Cancel", yesLabel = "Yes", tooltip = "Delete" } = props;
  if (tooltip)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <InnerPopover
            {...props}
            noLabel={noLabel}
            tooltip={tooltip}
            yesLabel={yesLabel}
          />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  return (
    <InnerPopover
      {...props}
      noLabel={noLabel}
      tooltip={tooltip}
      yesLabel={yesLabel}
    />
  );
}

const InnerPopover = function InnerPopover({
  children,
  noLabel = "Cancel",
  yesLabel = "Delete",
  variants,
  onConfirm,
  text,
  asChild,

  // NOTE: do NOT omit this, this includes hidden props from radix as well
  ...props
}: Prop) {
  const [open, setOpen] = useState(false);
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild={asChild} {...props}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <div className="text-lg font-semibold">
          {text?.header ?? "Confirm deletion"}
        </div>
        <div>
          {text?.description ??
            "Are you sure to delete this? This action cannot be undone."}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant={variants?.no ?? "default"}
          >
            {noLabel}
          </Button>
          <Button
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              setOpen(false);
            }}
            variant={variants?.yes ?? "destructive"}
          >
            {yesLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
