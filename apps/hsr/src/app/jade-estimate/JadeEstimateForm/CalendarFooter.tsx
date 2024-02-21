/* eslint-disable react/no-array-index-key */
import { sameDate } from "lib/utils";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import API from "@hsr/server/typedEndpoints";
import { usePatchDateHelper } from "@hsr/hooks/usePatchDateHelper";
import { LightConeIcon } from "@hsr/app/lightcone-db/LightConeIcon";
import { CharacterIcon } from "@hsr/app/character-db/CharacterIcon";
import { useFuturePatchDateList } from "@hsr/hooks/queries/useFuturePatchDate";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import { cn } from "lib";
import { trpc } from "@hsr/app/_trpc/client";

interface Prop {
  date: Date;
}

function CalendarFooter({ date }: Prop) {
  const { futurePatchDateList } = useFuturePatchDateList();
  const { data: bannerList } = trpc.honkai.banner.patchList.useQuery(
    undefined,
    { initialData: [] }
  );
  const { getVersion, currentPatch } = usePatchDateHelper();

  const major = getVersion(date)?.slice(0, 3) ?? "";
  const versionInfo = futurePatchDateList.find((e) =>
    e.version.startsWith(major)
  );

  const banner = useMemo(
    () => bannerList.find((e) => e.version === getVersion(date)),
    [bannerList, getVersion, date]
  );
  const charas = banner?.chara ?? [null, null, null, null];
  const lcs = banner?.lc ?? [null, null, null, null];

  const avatarQueries = useQueries({
    queries: charas.map((chara) => ({
      queryKey: ["character", chara?.id],
      queryFn: async () =>
        chara?.id
          ? API.character.get({ characterId: chara.id })
          : Promise.reject(new Error()),
      enabled: Boolean(banner) && Boolean(chara?.id),
    })),
  });

  const lcQueries = useQueries({
    queries: lcs.map((lc) => ({
      queryKey: ["lightConeMetadata", lc?.id],
      queryFn: async () =>
        lc?.id
          ? API.lightConeMetadata.get({ lcId: lc.id })
          : Promise.reject(new Error()),
      enabled: Boolean(lc) && Boolean(lc?.id),
    })),
  });

  const start = sameDate(date, currentPatch(date).startDate);

  return (
    <div className="mt-2.5 flex w-full flex-col items-center justify-center gap-2.5">
      <div className="text-center" id="patch-header">
        {start ? "Start of patch" : "Patch"} {getVersion(date)}
        {versionInfo ? <br /> : null}
        {versionInfo?.name}
      </div>

      <div>Character Banner</div>

      <div className="flex gap-2.5">
        {avatarQueries.map((query, index) =>
          query.data ? (
            <Link href={`character-db/${query.data.avatar_id}`} key={index}>
              <CharacterIcon data={query.data} />
            </Link>
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger disabled={!banner?.chara.at(index)?.placeholder}>
                <LoadingIcon
                  href={banner?.chara.at(index)?.href}
                  key={index}
                  rounded
                />
              </TooltipTrigger>
              {Boolean(banner?.chara.at(index)?.placeholder) && (
                <TooltipContent>
                  {banner?.chara[index]?.placeholder}
                </TooltipContent>
              )}
            </Tooltip>
          )
        )}
      </div>

      <div>Light Cone Banner</div>

      <div className="flex gap-2.5">
        {lcQueries.map((query, index) =>
          query.data ? (
            <Link href={`/lightcone-db/${query.data.equipment_id}`} key={index}>
              <LightConeIcon data={query.data} />
            </Link>
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger disabled={!banner?.lc.at(index)?.placeholder}>
                <LoadingIcon href={banner?.lc.at(index)?.href} key={index} />
              </TooltipTrigger>
              {Boolean(banner?.lc.at(index)?.placeholder) && (
                <TooltipContent>
                  {banner?.lc[index]?.placeholder}
                </TooltipContent>
              )}
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
}

function LoadingIcon({
  rounded = false,
  href,
}: {
  rounded?: boolean;
  href?: string;
}) {
  if (!href)
    return (
      <Skeleton
        className={cn("h-12 w-12", rounded ? "rounded-full" : "rounded-md")}
      />
    );
  return (
    <a href={href} rel="noopener" target="_blank">
      <Skeleton
        className={cn(
          "flex h-12 w-12 items-center justify-center",
          rounded ? "rounded-full" : "rounded-md"
        )}
      >
        <ExternalLink />
      </Skeleton>
    </a>
  );
}

export { CalendarFooter };
