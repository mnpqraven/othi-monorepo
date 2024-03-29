import type { Banner } from "@hsr/bindings/Banner";
import { range } from "lib/utils";
import type { PlainMessage } from "@bufbuild/protobuf";
import type { EChartsOption, SeriesOption } from "echarts";
import type { ProbabilityRateResponse } from "protocol/ts";

type ChartData = PlainMessage<ProbabilityRateResponse>;

export function chartOptions({
  data,
  currentEidolon,
  theme,
  selectedBanner,
}: {
  data: ChartData;
  currentEidolon: number;
  theme: string | undefined;
  selectedBanner: Banner;
}): EChartsOption {
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.data.map((_, index) => index),
    },
    yAxis: {
      axisLabel: {
        formatter: (params: string) => `${params} %`,
      },
      max: 100,
    },
    legend: {
      show: true,
      textStyle: { color: theme === "light" ? "black" : "white" },
    },
    series: Array.from(
      range(currentEidolon + 1, selectedBanner.maxConst, 1),
    ).map((eidolon) =>
      createChartSeries(
        selectedBanner.constShorthand,
        eidolon,
        data,
        selectedBanner.bannerType === "LC" ? 1 : 0,
      ),
    ),
    color: [
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
      "#fdffb6",
      // "#ffd6a5",
      "#ffadad",
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
          formatter: ({ value, axisDimension }) => {
            if (axisDimension === "x") return `Roll ${value.toString()}`;
            return `${Number(value).toFixed(2)} %`;
          },
        },
      },
      valueFormatter: (value) => `${value?.toString()} %`,
    },
  };
}

function createChartSeries(
  constShorthand: string,
  eidolon: number,
  queryData: ChartData,
  padding = 0,
): SeriesOption {
  const data = queryData.data.map((eidsInRoll) => {
    const currentEid =
      eidsInRoll.index.find((e) => e.eidolon === eidolon)?.rate ?? 0;
    return Number(currentEid * 100).toFixed(2);
  });
  const opt: EChartsOption["series"] = {
    name: `${constShorthand}${eidolon + padding}`,
    type: "line",
    showSymbol: false,
    areaStyle: { opacity: 0.2 + eidolon * 0.1 },
    emphasis: { disabled: true },
    data,
  };
  return opt;
}
