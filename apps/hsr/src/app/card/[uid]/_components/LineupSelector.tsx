"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { img } from "@hsr/lib/utils";
import { Toggle, Skeleton } from "ui/primitive";
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
        {charIds.map((id, index) =>
          id ? (
            <Toggle
              className="h-16 w-16 rounded-full p-0"
              key={index}
              pressed={index === selectIndex}
            >
              <Image
                alt=""
                className="cursor-pointer rounded-full border"
                height={64}
                onClick={() => {
                  setSelectIndex(index);
                }}
                src={img(`icon/avatar/${id}.png`)}
                width={64}
              />
            </Toggle>
          ) : (
            <Toggle className="h-16 w-16 rounded-full p-0" key={index}>
              <Skeleton className="h-16 w-16 rounded-full" />
            </Toggle>
          )
        )}
      </div>
    );
  }
);
LineupSelector.displayName = "LineupSelector";
