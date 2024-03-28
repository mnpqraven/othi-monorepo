import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import Image from "next/image";
import { elementVariant } from "@hsr/lib/variants";
import { cn } from "lib";

interface Prop {
  data: AvatarConfig;
}
function CharacterIcon({ data: avatar }: Prop) {
  return (
    <div className="flex flex-col gap-2.5" key={avatar.avatar_id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            alt=""
            className={cn(
              "h-12 w-12 rounded-full border",
              elementVariant({ border: avatar.damage_type }),
            )}
            height={128}
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/${avatar.avatar_id}.png`}
            width={128}
          />
        </TooltipTrigger>

        <TooltipContent>
          {avatar.avatar_name} - {avatar.rarity} ✦ {avatar.avatar_base_type}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
export { CharacterIcon };
