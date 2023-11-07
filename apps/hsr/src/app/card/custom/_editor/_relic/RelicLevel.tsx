import type { RelicInput } from "@hsr/app/card/_store/relic";
import type { PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { cn } from "lib";
import type { HTMLAttributes } from "react";
import { forwardRef, useMemo } from "react";
import { Input } from "ui/primitive";

interface Prop extends HTMLAttributes<HTMLInputElement> {
  atom: PrimitiveAtom<RelicInput>;
}

export const RelicLevel = forwardRef<HTMLInputElement, Prop>(
  ({ atom, className, ...props }, ref) => {
    const levelAtom = useMemo(
      () => focusAtom(atom, (optic) => optic.prop("level")),
      [atom]
    );
    const [level, setLevel] = useAtom(levelAtom);

    return (
      <Input
        className={cn("w-12", className)}
        max={15}
        min={0}
        onChange={(e) => {
          if (!Number.isNaN(e.target.value)) setLevel(parseInt(e.target.value));
        }}
        type="number"
        value={level}
        {...props}
        ref={ref}
      />
    );
  }
);
RelicLevel.displayName = "RelicLevel";
