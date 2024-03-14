"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { img } from "@hsr/lib/utils";
import { Toggle } from "ui/primitive";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "lib/utils";
import { mhyCharacterIds, selectedCharacterIndexAtom } from "../../_store/card";

type Props = HTMLAttributes<HTMLDivElement>;

export const LineupSelector = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const charIds = useAtomValue(mhyCharacterIds);
    const [selectIndex, setSelectIndex] = useAtom(selectedCharacterIndexAtom);

    return (
      <div
        className={cn(className, "flex gap-2 rounded-md border p-2")}
        ref={ref}
        {...props}
      >
        {charIds.map((id, index) => (
          <Toggle
            className="h-16 w-16 rounded-full p-0"
            key={id}
            pressed={index === selectIndex}
          >
            <Image
              alt={`char-${index}`}
              className="cursor-pointer rounded-full border"
              height={64}
              onClick={() => {
                setSelectIndex(index);
              }}
              src={img(`icon/avatar/${id}.png`)}
              width={64}
            />
          </Toggle>
        ))}
      </div>
    );
  }
);
LineupSelector.displayName = "LineupSelector";
