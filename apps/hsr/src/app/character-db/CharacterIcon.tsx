import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import Image from "next/image";
import { elementVariant } from "@hsr/lib/variants";
import { cn } from "lib";
import type { ReactNode } from "react";
import { CharacterTabWrapper } from "../components/Character/CharacterTabWrapper";

interface Prop {
  data: AvatarConfig;
  eidolonTableChildren?: ReactNode;
}
function CharacterIcon({ data: avatar, eidolonTableChildren }: Prop) {
  return (
    <div className="flex flex-col" key={avatar.avatar_id}>
      <p className="whitespace-pre-wrap text-center" />
      <div className="flex gap-2.5">
        <Dialog>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger>
                <Image
                  alt=""
                  className={cn(
                    "h-12 w-12 rounded-full border",
                    elementVariant({ border: avatar.damage_type })
                  )}
                  height={128}
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/${avatar.avatar_id}.png`}
                  width={128}
                />
              </TooltipTrigger>
            </DialogTrigger>

            <TooltipContent>
              {avatar.avatar_name} - {avatar.rarity} ✦ {avatar.avatar_base_type}
            </TooltipContent>
          </Tooltip>

          <DialogContent className="min-h-[16rem] sm:max-w-4xl">
            {avatar.avatar_id ? (
              <CharacterTabWrapper
                characterId={avatar.avatar_id}
                eidolonTableChildren={eidolonTableChildren}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export { CharacterIcon };
