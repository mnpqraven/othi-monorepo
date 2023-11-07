"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { range } from "lib/utils";
import styles from "@hsr/css/floating-card.module.css";
import type { Element } from "@hsr/bindings/PatchBanner";
import useCardEffect from "@hsr/hooks/animation/useCardEffect";
import type { Path } from "@hsr/bindings/AvatarConfig";
import { cn } from "lib";
import { PathIcon } from "../character-db/PathIcon";
import { ElementIcon } from "../character-db/ElementIcon";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  rarity?: number;
  element?: Element;
  path?: Path;
  name: string;
  imgUrl: string;
}

const LightConeCard = forwardRef<HTMLDivElement, Prop>(
  ({ rarity, element, path, name, imgUrl, className, ...props }, ref) => {
    const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div
          className="relative h-full w-full transition-all ease-out"
          onMouseLeave={removeListener}
          onMouseMove={rotateToMouse}
          ref={flowRef}
          style={{ perspective: "1500px" }}
        >
          <div
            className={cn(
              "absolute left-[18%] top-[14%] h-[76%] w-[65%] rotate-[13deg]",
              styles.card
            )}
          >
            <div className={styles.glow} ref={glowRef} />
          </div>
          <Image
            alt={name}
            className="aspect-[256/300]"
            height={300}
            priority={rarity === 5}
            src={imgUrl}
            width={256}
          />
          {element ? (
            <ElementIcon
              className="absolute left-1 top-0"
              element={element}
              size="15%"
            />
          ) : null}
        </div>
        {path ? (
          <PathIcon
            className={cn(
              "absolute left-1 text-white",
              element ? "top-[15%]" : "top-0"
            )}
            path={path}
            size="15%"
          />
        ) : null}
        {rarity ? (
          <RarityIcon className="-my-4 h-6 w-full" rarity={rarity} />
        ) : null}
      </div>
    );
  }
);
LightConeCard.displayName = "LightConeCard";

export { LightConeCard };

interface RarityIconProps extends HTMLAttributes<HTMLDivElement> {
  rarity: number;
}
const RarityIcon = forwardRef<HTMLDivElement, RarityIconProps>(
  ({ rarity, className, ...props }, ref) => (
    <div
      className={cn("absolute flex justify-center", className)}
      {...props}
      ref={ref}
    >
      {Array.from(range(1, rarity, 1)).map((i) => (
        <div className="aspect-square" key={i}>
          <Image
            alt={`${rarity} ✦`}
            className="pointer-events-none"
            height={128}
            src="/Star.png"
            width={128}
          />
        </div>
      ))}
    </div>
  )
);
RarityIcon.displayName = "RarityIcon";
