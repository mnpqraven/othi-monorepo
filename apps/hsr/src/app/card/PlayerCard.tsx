import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { img } from "@hsr/lib/utils";
import Link from "next/link";
import type { LANGS } from "@hsr/lib/constants";
import type { PrimitiveAtom } from "jotai";
import { useAtomValue } from "jotai";
import { Button, Separator } from "ui/primitive";
import { cn } from "lib";
import type { MihomoPlayer } from "./types";

type Lang = (typeof LANGS)[number];
interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  atom: PrimitiveAtom<MihomoPlayer | undefined> | PrimitiveAtom<MihomoPlayer>;
  lang?: Lang;
}
export const PlayerCard = forwardRef<HTMLButtonElement, Prop>(
  ({ atom, lang = "en", className, ...props }, ref) => {
    const player = useAtomValue(atom);
    const la = lang === "en" ? "" : `?lang=${lang}`;

    if (!player) return null;

    return (
      <Button
        className={cn("flex h-fit items-center gap-2.5", className)}
        ref={ref}
        variant="outline"
        {...props}
        asChild
      >
        <Link href={`card/${player.uid}${la}`}>
          <Image
            alt={player.avatar.name}
            height={84}
            src={img(player.avatar.icon)}
            width={84}
          />

          <div className="flex flex-col">
            <div className="flex justify-between gap-2">
              <span>{player.nickname}</span>
              <span>Level {player.level}</span>
              <span>EQ {player.world_level}</span>
            </div>

            <Separator className="my-1.5" />

            {player.signature !== "" && (
              <>
                <span>{player.signature}</span>

                <Separator className="my-1.5" />
              </>
            )}

            <div className="flex justify-between gap-2">
              <span>Characters: {player.space_info.avatar_count}</span>
              <span>Achievements: {player.space_info.achievement_count}</span>
            </div>
          </div>
        </Link>
      </Button>
    );
  },
);
PlayerCard.displayName = "PlayerCard";
