"use client";

import { useEffect, useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  defaultBanner,
  useBannerList,
} from "@hsr/hooks/queries/useGachaBannerList";
import { useLocalStorage } from "@hsr/hooks/useLocalStorage";
import STORAGE from "@hsr/server/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import equal from "fast-deep-equal/react";
import type { PlainMessage } from "@bufbuild/protobuf";
import { useCacheValidate } from "@hsr/hooks/useCacheValidate";
import type { ProbabilityRatePayload } from "protocol/ts";
import { BannerType, ProbabilityRateService } from "protocol/ts";
import { rpc } from "protocol";
import { ReactECharts } from "../components/ReactEcharts";
import { chartOptions } from "./chartOptions";
import { schema } from "./schema";
import { defaultGachaQuery } from "./types";
import { GachaForm } from "./GachaForm";

type FormSchema = PlainMessage<ProbabilityRatePayload>;

export default function GachaGraph() {
  const { theme } = useTheme();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultGachaQuery,
  });
  const eidolonSubscriber = form.watch("currentEidolon");
  const bannerSubscriber = form.watch("banner");

  const { data: bannerList } = useBannerList();
  const selectedBanner =
    bannerList.find((e) => e.bannerType === BannerType[bannerSubscriber]) ??
    defaultBanner;

  const [storagedForm, setStoragedForm] = useLocalStorage<FormSchema>(
    STORAGE.gachaForm,
    defaultGachaQuery
  );

  const { data } = useQuery({
    queryKey: ["probabilityRate", storagedForm],
    // safe cast
    queryFn: () =>
      storagedForm
        ? rpc(ProbabilityRateService).post(storagedForm)
        : Promise.reject(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (storagedForm) {
      form.reset(storagedForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storagedForm]);

  useCacheValidate({
    schema,
    schemaData: storagedForm,
    onReload: () => {
      setStoragedForm(defaultGachaQuery);
      form.reset(defaultGachaQuery);
    },
  });

  // this is getting triggered every re-render
  const chartOption = useMemo(
    () =>
      chartOptions({
        data: data ?? { data: [], rollBudget: 0 },
        currentEidolon: eidolonSubscriber,
        selectedBanner,
        theme,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedBanner, theme]
  );

  function updateQuery(payload: FormSchema) {
    if (!equal(payload, defaultGachaQuery) && !equal(storagedForm, payload)) {
      setStoragedForm(payload);
    }
  }

  return (
    <>
      <div className="py-4">
        <GachaForm
          form={form}
          selectedBanner={selectedBanner}
          updateQuery={updateQuery}
        />
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
