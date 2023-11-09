"use client";

import { useAtom, useAtomValue } from "jotai";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { Input, Label } from "ui/primitive";
import { cn } from "lib";
import { maxLevelAtom } from "../../_store/lightcone";
import { lcImpositionAtom, lcLevelAtom, lcPromotionAtom } from "../../_store";

export function LightConeUpdater() {
  const maxLevel = useAtomValue(maxLevelAtom);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="level">Level</Label>
        <LevelInput id="level" />
        <span>/{maxLevel}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="promotion">Ascension</Label>
        <PromotionInput id="promotion" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="rank">Imposition</Label>
        <ImpositionInput id="rank" />
      </div>
    </div>
  );
}

const LevelInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const maxLevel = useAtomValue(maxLevelAtom);
  const [level, setLevel] = useAtom(lcLevelAtom);

  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={maxLevel}
      min={1}
      onChange={(e) => {
        const val = Number(e.target.value);
        if (val >= 1 && val <= maxLevel) setLevel(val);
        else if (val === 0) setLevel(1);
      }}
      type="number"
      value={level}
      {...props}
      ref={ref}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [ascension, setAscension] = useAtom(lcPromotionAtom);
  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={6}
      min={0}
      onChange={(e) => {
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setAscension(val);
      }}
      type="number"
      value={ascension}
      {...props}
      ref={ref}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const ImpositionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [rank, setRank] = useAtom(lcImpositionAtom);
  return (
    <Input
      autoComplete="off"
      className={cn("w-12", className)}
      max={5}
      min={1}
      onChange={(e) => {
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setRank(val);
      }}
      type="number"
      value={rank}
      {...props}
      ref={ref}
    />
  );
});
ImpositionInput.displayName = "ImpositionInput";
