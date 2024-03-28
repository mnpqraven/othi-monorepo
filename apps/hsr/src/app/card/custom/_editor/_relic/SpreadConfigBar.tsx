import { Button, Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import type { PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import type { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import { cva } from "class-variance-authority";
import { cn } from "lib";
import { substatRollButtons } from "./relicConfig";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  atom: PrimitiveAtom<number>;
  spreadInfo: RelicSubAffixConfig;
}

const variant = cva("border-skewed mb-2 h-1.5 w-8", {
  variants: {
    status: {
      LOW: "bg-[#4f79b2]",
      MID: "bg-[#c199fd]",
      HIGH: "bg-[#ffc870]",
      ERROR: "bg-red-500",
      default: "bg-gray-600",
    },
  },
  defaultVariants: { status: "default" },
});

const SpreadConfigBar = forwardRef<HTMLDivElement, Prop>(
  ({ atom, spreadInfo, className, ...props }, ref) => {
    const [ssValue, setSsValue] = useAtom(atom);

    function roll(key: "HIGH" | "MID" | "LOW" | "NONE") {
      setSsValue(getRollValue(key, spreadInfo));
    }

    return (
      <div
        className={cn(className, "flex flex-col items-center")}
        ref={ref}
        {...props}
      >
        <div
          className={variant({
            status:
              ssValue > 0 ? judgeRollValue(ssValue, spreadInfo) : "default",
          })}
        />
        {substatRollButtons.map(({ key, icon, label }) => (
          <Tooltip disableHoverableContent key={key}>
            <TooltipTrigger asChild>
              <Button
                className="h-6 w-6 p-0"
                onClick={() => {
                  roll(key);
                }}
                variant="outline"
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  },
);
SpreadConfigBar.displayName = "SpreadConfigBar";
export { SpreadConfigBar };

export function judgeRollValue(
  value: number,
  spreadInfo: RelicSubAffixConfig,
): "LOW" | "MID" | "HIGH" | "ERROR" {
  // 5% correction
  const lowerBound = spreadInfo.base_value * 0.95;
  const upperBound =
    spreadInfo.base_value + spreadInfo.step_num * spreadInfo.step_value * 1.05;

  const diffPool = upperBound - lowerBound;
  // this is supposed to never happen
  if (upperBound <= lowerBound) return "ERROR";

  const valueDiff = value - lowerBound;
  const ratio = valueDiff / diffPool;

  if (ratio < 0) return "ERROR";
  if (ratio >= 0 && ratio < 0.33) return "LOW";
  if (ratio >= 0.33 && ratio < 0.66) return "MID";
  return "HIGH";
}

function getRollValue(
  key: "HIGH" | "MID" | "LOW" | "NONE",
  spreadConfig: RelicSubAffixConfig,
): number {
  const { base_value, step_num, step_value } = spreadConfig;
  switch (key) {
    case "HIGH":
      return base_value + step_num * step_value;
    case "MID":
      return base_value + (step_num * step_value) / 2;
    case "LOW":
      return base_value;
    case "NONE":
      return 0;
  }
}
