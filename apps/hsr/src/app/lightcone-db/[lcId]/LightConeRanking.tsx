"use client";

import type { EquipmentRanking } from "@hsr/bindings/EquipmentRanking";
import API from "@hsr/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import { AxisRight } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import type { ParentSizeProvidedProps } from "@visx/responsive/lib/components/ParentSize";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Bar, BarStackHorizontal } from "@visx/shape";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/primitive";

interface Prop {
  id: number;
}

// hp atk def
const hpColor = "#10b981";
const atkColor = "#f43f5e";
const defColor = "#0ea5e9";
const activeColors = [hpColor, atkColor, defColor];

const inactiveHpColor = "#022c22";
const inactiveAtkColor = "#4c0519";
const inactiveDefColor = "#082f49";
const inactiveColors = [inactiveHpColor, inactiveAtkColor, inactiveDefColor];

const textActive = "#212529";
const textInactive = "#ADB5BD";

function LightConeRanking({ id }: Prop) {
  const { data } = useQuery({
    queryKey: ["lightConeRanking"],
    queryFn: API.lightConeRanking.get,
  });

  const [dataKey, setDatakey] = useState<"atk" | "def" | "hp" | "all">("all");

  const accessor = useCallback(() => {
    return (e: EquipmentRanking) => {
      if (dataKey === "all") {
        return (
          (e.atk[DEFAULT_INDEX] ?? 0) +
          (e.def[DEFAULT_INDEX] ?? 0) +
          (e.hp[DEFAULT_INDEX] ?? 0)
        );
      }
      return e[dataKey][DEFAULT_INDEX] ?? 0;
    };
  }, [dataKey]);

  // if (!data) return <>loading</>;

  const sortedList = data?.list.sort((a, b) => {
    const nameCmp = a.equipment_name.localeCompare(b.equipment_name);
    return accessor()(b) - accessor()(a) || nameCmp;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stat ranking</CardTitle>
        <CardDescription>
          Pure stat ranking compared to other light cones
        </CardDescription>
      </CardHeader>
      {data && sortedList ? (
        <CardContent>
          <Select
            defaultValue={dataKey}
            onValueChange={(e) => {
              setDatakey(e as typeof dataKey);
            }}
          >
            <SelectTrigger className="bg-background sticky top-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atk">Attack</SelectItem>
              <SelectItem value="def">Defense</SelectItem>
              <SelectItem value="hp">HP</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4 h-[450px] overflow-auto rounded-md">
            <ParentSize debounceTime={10}>
              {(parent) => (
                <RankingChart
                  currentLcId={id}
                  data={sortedList}
                  dataAccessor={accessor()}
                  mode={dataKey}
                  {...parent}
                  height={sortedList.length * 40}
                  promotion={DEFAULT_INDEX}
                />
              )}
            </ParentSize>
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex justify-center gap-2">
          <Loader2 className="animate-spin" />
          Loading ...
        </CardContent>
      )}
    </Card>
  );
}

const DEFAULT_INDEX = 6;

let tooltipTimeout: number;
interface TooltipData {
  name: string;
  atk: number;
  hp: number;
  def: number;
}

interface ChartProps extends ParentSizeProvidedProps {
  data: EquipmentRanking[];
  currentLcId: number;
  dataAccessor: (e: EquipmentRanking) => number;
  mode: "atk" | "def" | "hp" | "all";
  promotion: number;
}
function RankingChart({
  data,
  currentLcId,
  dataAccessor,
  promotion,
  height,
  mode,
  width,
}: ChartProps) {
  const xMax = width;
  const yMax = height;
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  } = useTooltip<TooltipData>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });
  const currentLcIndex = data.findIndex((e) => e.equipment_id === currentLcId);

  // x axis: value
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, Math.max(...data.map(dataAccessor))],
        range: [xMax, 0],
        round: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xMax, dataAccessor]
  );

  const getEquiment = (e: EquipmentRanking) => e.equipment_name;

  // yaxis: ID
  const yScale = useMemo(
    () =>
      scaleBand<string>({
        domain: data.map(getEquiment),
        range: [0, yMax],
        round: true,
        paddingInner: 0.2,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [height, dataAccessor]
  );

  if (width < 10) return null;

  if (mode !== "all")
    return (
      <div className="relative">
        <svg height={height} ref={containerRef} width={width}>
          <Group>
            {data.map((dataPoint) => {
              const barHeight = yScale.bandwidth();
              const barWidth = width - xScale(dataAccessor(dataPoint));

              const barY = yScale(dataPoint.equipment_name);
              const isCurrent = dataPoint.equipment_id === currentLcId;

              return (
                <Bar
                  fill={
                    isCurrent
                      ? "rgba(23, 233, 217, .5)"
                      : "rgba(190, 190, 190, .5)"
                  }
                  height={barHeight}
                  key={`bar-${dataPoint.equipment_id}`}
                  onMouseLeave={() => {
                    tooltipTimeout = window.setTimeout(() => {
                      hideTooltip();
                    }, 300);
                  }}
                  onMouseMove={(event) => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    // TooltipInPortal expects coordinates to be relative to containerRef
                    // localPoint returns coordinates relative to the nearest SVG, which
                    // is what containerRef is set to in this example.
                    const eventSvgCoords = localPoint(event);
                    const _left = (barWidth * 2) / 3;
                    showTooltip({
                      tooltipData: toTooltipData(dataPoint, DEFAULT_INDEX),
                      tooltipTop: eventSvgCoords?.y,
                      tooltipLeft: eventSvgCoords?.x,
                    });
                  }}
                  rx={6}
                  width={barWidth}
                  x={0}
                  y={barY}
                />
              );
            })}
            <AxisRight
              hideAxisLine
              hideTicks
              numTicks={99}
              scale={yScale}
              tickFormat={(name, index) => `#${index + 1} ${name}`}
              tickLabelProps={(_name, index) => ({
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "Arial",
                verticalAnchor: "middle",
                fill: index === currentLcIndex ? textActive : textInactive,
              })}
            />
          </Group>
        </svg>
        {tooltipOpen && tooltipData ? (
          <TooltipInPortal left={tooltipLeft} top={tooltipTop}>
            <div>{tooltipData.name}</div>
            <div>HP: {tooltipData.hp.toFixed(0)}</div>
            <div>ATK: {tooltipData.atk.toFixed(0)}</div>
            <div>DEF: {tooltipData.def.toFixed(0)}</div>
          </TooltipInPortal>
        ) : null}
      </div>
    );

  // sum graph

  type MultiKeys = "atk" | "def" | "hp";
  const keys: MultiKeys[] = ["hp", "atk", "def"];
  const colorScale = scaleOrdinal<MultiKeys, string>({
    domain: keys,
    range: activeColors,
  });

  const omittedIndexData = data.map((e) => {
    return {
      equipment_id: e.equipment_id,
      equipment_name: e.equipment_name,
      level: e.level[promotion] ?? 0,
      atk: e.atk[promotion] ?? 0,
      def: e.def[promotion] ?? 0,
      hp: e.hp[promotion] ?? 0,
    };
  });
  const xScaleTotal = scaleLinear<number>({
    domain: [0, Math.max(...omittedIndexData.map((e) => e.atk + e.def + e.hp))],
    range: [0, xMax],
    round: true,
  });

  return (
    <div>
      <svg height={height} ref={containerRef} width={width}>
        <Group>
          <BarStackHorizontal<(typeof omittedIndexData)[number], MultiKeys>
            color={colorScale}
            data={omittedIndexData}
            keys={keys}
            xScale={xScaleTotal}
            y={(e) => e.equipment_name}
            yScale={yScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => {
                  const isActive = bar.index === currentLcIndex;
                  const colors = isActive ? activeColors : inactiveColors;

                  return (
                    <rect
                      fill={colors[barStack.index]}
                      height={bar.height}
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={(event) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        // TooltipInPortal expects coordinates to be relative to containerRef
                        // localPoint returns coordinates relative to the nearest SVG, which
                        // is what containerRef is set to in this example.
                        const eventSvgCoords = localPoint(event);
                        showTooltip({
                          tooltipData: toTooltipData(
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data[bar.index]!,
                            DEFAULT_INDEX
                          ),
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: eventSvgCoords?.x,
                        });
                      }}
                      rx={6}
                      width={bar.width}
                      x={bar.x}
                      y={bar.y}
                    />
                  );
                })
              )
            }
          </BarStackHorizontal>
          <AxisRight
            hideAxisLine
            hideTicks
            numTicks={999}
            scale={yScale}
            tickFormat={(name, index) => `#${index + 1} ${name}`}
            tickLabelProps={(_name, index) => ({
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "Arial",
              verticalAnchor: "middle",
              fill: index === currentLcIndex ? textActive : textInactive,
            })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData ? (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop}>
          <div>{tooltipData.name}</div>
          <div>HP: {tooltipData.hp.toFixed(0)}</div>
          <div>ATK: {tooltipData.atk.toFixed(0)}</div>
          <div>DEF: {tooltipData.def.toFixed(0)}</div>
        </TooltipInPortal>
      ) : null}
    </div>
  );
}

function toTooltipData(
  point: EquipmentRanking,
  promotionIndex: number
): TooltipData {
  const { atk, def, hp, equipment_name } = point;
  return {
    atk: atk[promotionIndex] ?? 0,
    def: def[promotionIndex] ?? 0,
    hp: hp[promotionIndex] ?? 0,
    name: equipment_name,
  };
}

export { LightConeRanking };
