"use client";

import { useAtomValue, useSetAtom } from "jotai";
import type { LANGS } from "@hsr/lib/constants";
import { useEffect, useRef } from "react";
import { CharacterInfo } from "../../[uid]/_components/info_block/CharacterInfo";
import { EidolonInfo } from "../../[uid]/_components/skill_block/EidolonInfo";
import { LightConeInfo } from "../../[uid]/_components/skill_block/LightConeInfo";
import { SkillInfo } from "../../[uid]/_components/skill_block/SkillInfo";
import { StatTable } from "../../[uid]/_components/stat_block/StatTable";
import { SpiderChartWrapper } from "../../[uid]/_components/SpiderChartWrapper";
import { RelicInfo } from "../../[uid]/_components/relic_block/RelicInfo";
import { configAtom } from "../../_store/main";
import { enkaRefAtom } from "../../_store";
import { charMetadataAtom } from "../../_store/character";
import { useMihomoApiUpdate } from "./useMihomoApiUpdate";

type Lang = (typeof LANGS)[number];
export type DisplayCardProps =
  | {
      mode: "API";
      uid: string;
      lang: Lang | undefined;
    }
  | { mode: "CUSTOM" };

export function DisplayCard(props: DisplayCardProps) {
  const updateConfig = useSetAtom(configAtom);
  const { enkaRef } = useEnkaRef();
  const { data: charMetadata } = useAtomValue(charMetadataAtom);

  useEffect(() => {
    updateConfig({ type: "changeMode", payload: props.mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMihomoApiUpdate(props);

  if (!charMetadata) return "Please select a character";

  return (
    <div className="h-fit w-fit p-4" ref={enkaRef}>
      <div
        className="border-border bg-background grid h-[600px] w-[1496px] grid-cols-4 rounded-2xl border p-3"
        id="enka-container"
        style={{
          boxShadow: "0 1px 10px hsl(var(--border))",
        }}
      >
        <CharacterInfo
          characterId={charMetadata.avatar_id}
          className="relative z-10"
          id="block-1"
        />

        <div className="flex justify-evenly" id="block-2">
          <EidolonInfo characterId={charMetadata.avatar_id} className="w-14" />
          <div className="flex flex-col pb-2">
            <LightConeInfo className="grow" id="lightcone-2.1" />

            <SkillInfo characterId={charMetadata.avatar_id} id="skill-2.2" />
          </div>
        </div>

        <div className="col-span-2 flex gap-4" id="block-3">
          <div className="flex grow flex-col gap-2 place-self-end pb-2">
            <SpiderChartWrapper element={charMetadata.damage_type} />

            <StatTable
              className="grid grid-cols-2 gap-x-2"
              element={charMetadata.damage_type}
              id="stat-3"
            />
          </div>

          <RelicInfo className="justify-end pb-2" id="relic-4" />
        </div>
      </div>
    </div>
  );
}

function useEnkaRef() {
  const enkaRef = useRef<HTMLDivElement>(null);
  const setEnkaRef = useSetAtom(enkaRefAtom);
  useEffect(() => {
    setEnkaRef(enkaRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { enkaRef };
}
