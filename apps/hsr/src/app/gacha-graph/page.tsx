"use client";

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { BannerType } from "protocol/ts";
import {
  defaultBanner,
  useBannerList,
} from "@hsr/hooks/queries/useGachaBannerList";
import { useAtomValue } from "jotai";
import { post } from "protocol/ts/probabilityrate-ProbabilityRateService_connectquery";
import { ReactECharts } from "../components/ReactEcharts";
import { chartOptions } from "./chartOptions";
import { GachaForm } from "./GachaForm";
import { gachaGraphFormAtom } from "./store";

export default function Page() {
  const { theme } = useTheme();

  const storagedForm = useAtomValue(gachaGraphFormAtom);

  const { data: bannerList } = useBannerList();
  const selectedBanner =
    bannerList.find((e) => e.bannerType === BannerType[storagedForm.banner]) ??
    defaultBanner;

  const { data } = useQuery({
    ...post.useQuery(storagedForm),
    placeholderData: keepPreviousData,
  });

  // NOTE: this is getting triggered every re-render
  const chartOption = useMemo(
    () =>
      chartOptions({
        data: data ?? { data: [], rollBudget: 0 },
        currentEidolon: storagedForm.currentEidolon,
        selectedBanner,
        theme,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedBanner, theme]
  );

  return (
    <>
      <div className="py-4">
        <GachaForm selectedBanner={selectedBanner} />
      </div>
      {data && data.rollBudget > 0 ? (
        <ReactECharts
          option={chartOption}
          settings={{ replaceMerge: "series", notMerge: true }}
          style={{ height: "700px" }}
        />
      ) : null}
    </>
  );
}
