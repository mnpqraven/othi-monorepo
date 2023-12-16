"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "@hsr/css/floating-card.module.css";
import type { Element } from "@hsr/bindings/PatchBanner";
import useCardEffect from "@hsr/hooks/animation/useCardEffect";
import type { Path } from "@hsr/bindings/AvatarConfig";
import { cn, range } from "lib";
import { PathIcon } from "./PathIcon";
import { ElementIcon } from "./ElementIcon";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  rarity: number;
  element?: Element;
  path: Path;
  name: string;
  imgUrl: string;
}

const CharacterCard = forwardRef<HTMLDivElement, Prop>(
  ({ rarity, path, name, element, imgUrl, className, ...props }, ref) => {
    const { glowRef, flowRef, rotateToMouse, removeListener } = useCardEffect();
    return (
      <div
        className={cn("relative", className)}
        ref={ref}
        style={{ perspective: "1500px" }}
        {...props}
      >
        <div
          className={cn(
            "relative h-full w-full rounded-tr-3xl border-b-2 bg-gradient-to-b from-transparent from-80%  to-black/50",
            rarity === 5 ? "border-[#ffc870]" : "border-[#c199fd]",
            styles.card
          )}
          onMouseLeave={removeListener}
          onMouseMove={rotateToMouse}
          ref={flowRef}
        >
          <Image
            alt={name}
            className={cn(
              "aspect-[374/512] rounded-tr-3xl bg-gradient-to-b",
              rarity === 5 ? "bg-[#d0aa6e]" : "bg-[#9c65d7]"
            )}
            height={512}
            priority={rarity === 5}
            src={imgUrl}
            width={374}
          />
          {element ? (
            <ElementIcon
              className="absolute left-1 top-0"
              element={element}
              ignoreTheme
              size="15%"
            />
          ) : null}
          <PathIcon
            className={cn(
              "absolute left-1 text-white",
              element ? "top-[15%]" : "top-0"
            )}
            ignoreTheme
            path={path}
            size="15%"
          />
          <RarityIcon className="top-[85%] h-6 w-full" rarity={rarity} />
          <div className={cn("rounded-tr-3xl", styles.glow)} ref={glowRef} />
        </div>
      </div>
    );
  }
);
CharacterCard.displayName = "CharacterCard";

export { CharacterCard };

interface RarityIconProps extends HTMLAttributes<HTMLDivElement> {
  rarity: number;
}
export const RarityIcon = forwardRef<HTMLDivElement, RarityIconProps>(
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
            className="pointer-events-none h-full"
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
