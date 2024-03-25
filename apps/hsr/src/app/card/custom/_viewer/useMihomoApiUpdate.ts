"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useRelics } from "@hsr/hooks/queries/useRelic";
import type { RelicConfig, RelicType } from "@hsr/bindings/RelicConfig";
import { useQueryClient } from "@tanstack/react-query";
import { optionLightConePromotion } from "@hsr/hooks/queries/lightcone";
import { trpc } from "protocol";
import { mhyCharacterIds } from "../../_store/card";
import {
  charStructAtom,
  configAtom,
  lcStructAtom,
  relicsStructAtom,
  selectedCharacterIndexAtom,
} from "../../_store";
import { useMihomoInfo } from "../../[uid]/useMihomoInfo";
import type { DisplayCardProps } from "./DisplayCard";

export function useMihomoApiUpdate(props: DisplayCardProps) {
  const { mode } = props;
  const { query } = useMihomoInfo(
    mode === "API"
      ? { uid: props.uid, lang: props.lang }
      : { uid: undefined, lang: undefined }
  );
  const setCharStruct = useSetAtom(charStructAtom);
  const setLcStruct = useSetAtom(lcStructAtom);
  const setRelicStruct = useSetAtom(relicsStructAtom);
  const charIndex = useAtomValue(selectedCharacterIndexAtom);
  const setMhyCharIds = useSetAtom(mhyCharacterIds);
  const [setIds, updateSetIds] = useState<number[]>([]);
  const { data: relicsData } = useRelics(setIds);
  const updateConfig = useSetAtom(configAtom);
  const client = useQueryClient();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (query.data) {
      const charIds = query.data.characters.map((e) => e.id);
      const lcIds = query.data.characters
        .filter((e) => Boolean(e.light_cone))
        .map((e) => e.light_cone?.id);

      charIds.forEach((e) => {
        const charId = Number(e);
        void utils.honkai.avatar.trace.by.prefetch({ charId });
        void utils.honkai.avatar.promotions.by.prefetch({ charId });
        void utils.honkai.avatar.by.prefetch({ charId });
      });
      lcIds.forEach((e) => {
        const lcId = Number(e);
        void client.prefetchQuery(optionLightConePromotion(lcId));
        void utils.honkai.lightCone.by.prefetch({ lcId });
      });
    }
  }, [client, query.data, utils]);

  useEffect(() => {
    if (query.data && props.mode === "API") {
      const { nickname, uid } = query.data.player;
      updateConfig({ type: "changeUser", payload: { name: nickname, uid } });

      setMhyCharIds(query.data.characters.map((e) => Number(e.id)));

      const tempSetIds = query.data.characters
        .map((e) => e.relics.map((a) => Number(a.set_id)))
        .flat();
      updateSetIds(Array.from(new Set(tempSetIds)));

      const chara = query.data.characters.at(charIndex);
      if (chara) {
        const skillsPairs = chara.skills.map((skill) => [
          skill.id,
          skill.level,
        ]);
        const tracePairs = chara.skill_trees.map((trace) => [
          trace.id,
          trace.level > 0,
        ]);

        setCharStruct({
          id: Number(chara.id),
          level: chara.level,
          ascension: chara.promotion,
          eidolon: chara.rank,
          skills: Object.fromEntries(skillsPairs),
          trace: Object.fromEntries(tracePairs),
        });
      }

      if (chara?.light_cone) {
        setLcStruct({
          id: Number(chara.light_cone.id),
          level: chara.light_cone.level,
          ascension: chara.light_cone.promotion,
          imposition: chara.light_cone.rank,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, query.data, charIndex]);

  useEffect(() => {
    if (query.data && props.mode === "API" && relicsData) {
      const relics = query.data.characters[charIndex]?.relics;
      if (relics) {
        setRelicStruct(
          relics.map(
            ({ id, level, rarity, set_id: setId, main_affix, sub_affix }) => {
              return {
                id: Number(id),
                rarity,
                setId: Number(setId),
                type: findRelicType({ id, setId, relicsData }),
                level,
                property: main_affix.type,
                subStats: sub_affix.map(
                  ({ type: property, value, count: step }) => ({
                    property,
                    value,
                    step,
                  })
                ),
              };
            }
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, props.mode, relicsData, charIndex]);
}

function findRelicType({
  id,
  setId,
  relicsData,
}: {
  id: string;
  setId: string;
  relicsData: RelicConfig[];
}): RelicType {
  const find = relicsData.find(
    (e) => e.id === Number(id) && e.set_id === Number(setId)
  );
  return find ? find.ttype : "HEAD";
}
