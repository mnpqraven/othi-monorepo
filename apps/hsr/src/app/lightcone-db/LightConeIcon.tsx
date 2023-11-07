import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";

interface Prop {
  data: EquipmentConfig;
}

function LightConeIcon({ data: lc }: Prop) {
  return (
    <div className="flex flex-col" key={lc.equipment_id}>
      <p className="whitespace-pre-wrap text-center" />
      <div className="flex gap-2.5">
        <Dialog>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger>
                <Image
                  alt=""
                  className="h-12 w-12"
                  height={48}
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/light_cone/${lc.equipment_id}.png`}
                  width={48}
                />
              </TooltipTrigger>
            </DialogTrigger>

            <TooltipContent>
              {lc.equipment_name} - {lc.rarity} ✦
            </TooltipContent>
          </Tooltip>

          <DialogContent className="min-h-[16rem] sm:max-w-4xl">
            {/* lc.avatar_id && (
              <CharacterTabWrapper characterId={lc.avatar_id} />
            ) */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export { LightConeIcon };
