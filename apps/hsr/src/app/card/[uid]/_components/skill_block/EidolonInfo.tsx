import { img } from "@hsr/lib/utils";
import type { HTMLAttributes } from "react";
import { Fragment, forwardRef } from "react";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { charEidAtom } from "@hsr/app/card/_store";
import { hoverVerbosityAtom } from "@hsr/app/card/_store/main";
import { cn, range, sanitizeNewline } from "lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui/primitive";
import { trpc } from "@hsr/app/_trpc/client";
import type { EidolonSchema } from "database/schema";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}
export const EidolonInfo = forwardRef<HTMLDivElement, Prop>(
  ({ className, characterId, ...props }, ref) => {
    const { data: eidolons } = trpc.honkai.avatar.eidolons.useQuery({
      charId: characterId,
    });
    const eidolon = useAtomValue(charEidAtom);

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 pt-[72px]",
          className
        )}
        ref={ref}
        {...props}
      >
        {Array.from(range(1, 6)).map((eid) => (
          <EidolonIcon
            currentEidolon={eid}
            eidolon={eidolon}
            eidolonInfo={eidolons?.at(eid - 1)}
            key={eid}
            src={img(getUrl(eid, characterId))}
          />
        ))}
      </div>
    );
  }
);
EidolonInfo.displayName = "EidolonInfo ";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  currentEidolon: number;
  eidolon: number;
  width?: number;
  height?: number;
  eidolonInfo: EidolonSchema | undefined;
}
const EidolonIcon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      src,
      currentEidolon,
      eidolonInfo,
      eidolon,
      width = 48,
      height = 48,
      className,
      ...props
    },
    ref
  ) => {
    const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

    return (
      <Tooltip>
        <TooltipTrigger disabled={hoverVerbosity === "none"}>
          <div className={cn("", className)} ref={ref} {...props}>
            <Image
              alt={String(currentEidolon)}
              className={cn(
                "invert dark:invert-0",
                currentEidolon <= eidolon ? "opacity-100" : "opacity-25"
              )}
              height={height}
              src={src}
              width={width}
            />
          </div>
        </TooltipTrigger>
        {hoverVerbosity === "simple" ? (
          <TooltipContent side="left">{eidolonInfo?.name}</TooltipContent>
        ) : null}
        {hoverVerbosity === "detailed" ? (
          <TooltipContent
            className="w-96 py-2 text-justify text-base"
            side="left"
          >
            <p className="text-accent-foreground mb-2 text-base font-bold">
              {eidolonInfo?.name}
            </p>
            {eidolonInfo?.desc?.map((descPart, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                <span className="whitespace-pre-wrap">
                  {sanitizeNewline(descPart)}
                </span>
                <span className="text-accent-foreground font-semibold">
                  {eidolonInfo.param[index]}
                </span>
              </Fragment>
            ))}
          </TooltipContent>
        ) : null}
      </Tooltip>
    );
  }
);
EidolonIcon.displayName = "EidolonIcon ";

function getUrl(rank: number, charId: number): string {
  switch (rank) {
    case 1:
      return `icon/skill/${charId}_rank1.png`;
    case 2:
      return `icon/skill/${charId}_rank2.png`;
    case 3:
      return `icon/skill/${charId}_skill.png`;
    case 4:
      return `icon/skill/${charId}_rank4.png`;
    case 5:
      return `icon/skill/${charId}_ultimate.png`;
    case 6:
      return `icon/skill/${charId}_rank6.png`;
    default:
      return "";
  }
}
