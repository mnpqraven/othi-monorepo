import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Point } from "@visx/point";
import { Line, LineRadial } from "@visx/shape";
import Svg from "react-inlinesvg";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import type { MouseEventHandler, ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { localPoint } from "@visx/event";
import { voronoi } from "@visx/voronoi";
import { rotate } from "lib";

export interface RadarProps<T> {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
  data: T[];
  valueAccessor: (data: T) => number;
  iconAccessor: (data: T) => string;
  tooltipRender?: (data: T) => ReactNode;
}

const DEGREES = 360;

const orange = "#ff9933";
const pumpkin = "#f5810c";
const silver = "#d9d9d9";
// export const background = "#FAF7E900";
const background = "#00000000";

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle:
      i * (DEGREES / length) + (length % 2 === 0 ? 0 : DEGREES / length / 2),
  }));

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

function genPolygonPoints<Datum>(
  dataArray: Datum[],
  scale: (n: number) => number,
  getValue: (d: Datum) => number,
) {
  const step = (Math.PI * 2) / dataArray.length;
  const points: { x: number; y: number }[] = new Array(dataArray.length).fill({
    x: 0,
    y: 0,
  });
  const pointString: string = new Array(dataArray.length + 1)
    .fill("")
    .reduce((res: string, _, i) => {
      let next = res;
      if (i > dataArray.length) return next;
      const xVal = scale(getValue(dataArray[i - 1]!)) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1]!)) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };
      next += `${xVal},${yVal} `;
      return next;
    });

  return { points, pointString };
}

const DEFAULT_MARGINS = { top: 0, left: 40, right: 40, bottom: 0 };

export function SpiderChart<T>({
  width,
  height,
  levels = 4,
  margin = DEFAULT_MARGINS,
  data,
  valueAccessor,
  iconAccessor,
  tooltipRender,
}: RadarProps<T>) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [DEGREES, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, radius],
    // NOTE: this domain uses the data's max value as edge
    // domain: [0, Math.max(...data.map(y))],
    // NOTE: this domain uses normalized value range from 0 to 1
    domain: [0, 1],
  });

  const webs = genAngles(data.length);
  const points = genPoints(data.length, radius);
  const textAnchors = rotate(-1, genPoints(data.length, radius + 20));

  const polygonPoints = genPolygonPoints(data, (d) => yScale(d), valueAccessor);
  const zeroPoint = new Point({ x: 0, y: 0 });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<{ index: number }>();
  const isTooltipVisible =
    tooltipOpen && tooltipData && tooltipRender && data.at(tooltipData.index);

  const voronoiLayout = useMemo(
    () =>
      voronoi<{ x: number; y: number }>({
        x: (d) => d.x + width / 2,
        y: (d) => d.y + height / 2 - margin.top,
        width,
        height,
      })(polygonPoints.points),
    [width, height, margin, polygonPoints.points],
  );

  const handleMouseMove: MouseEventHandler<SVGRectElement> = useCallback(
    (event) => {
      const coords = localPoint(event);
      if (coords?.x && coords.y) {
        const closest = voronoiLayout.find(coords.x, coords.y, width / 3);

        showTooltip({
          tooltipLeft: coords.x,
          tooltipTop: coords.y,
          tooltipData: { index: closest?.index ?? 0 },
        });
      }
    },
    [showTooltip, voronoiLayout, width],
  );

  return width < 10 ? null : (
    <>
      <svg height={height} width={width}>
        <Group left={width / 2} top={height / 2 - margin.top}>
          {[...new Array(levels)].map((_, i) => (
            <LineRadial
              angle={(d) => radialScale(d.angle)}
              data={webs}
              fill="none"
              key={`web-${i}`}
              radius={((i + 1) * radius) / levels}
              stroke={silver}
              strokeLinecap="round"
              strokeOpacity={0.6}
              strokeWidth={i % 2 === 0 ? 1 : 2}
            />
          ))}
          {[...new Array(data.length)].map((_, i) => (
            <Line
              from={zeroPoint}
              key={`radar-line-${i}`}
              stroke={silver}
              to={points[i]}
            />
          ))}
          {data.map((item, i) => (
            // TODO: dynamic x y coords according to index
            <Svg
              fill="white"
              height={24}
              // eslint-disable-next-line react/no-array-index-key
              key={`annotate-${i}`}
              src={iconAccessor(item)}
              width={24}
              x={textAnchors[i]!.x - 10}
              y={textAnchors[i]!.y - 10}
            />
          ))}
          <polygon
            fill={orange}
            fillOpacity={0.3}
            points={polygonPoints.pointString}
            stroke={orange}
            strokeWidth={2}
          />
          {polygonPoints.points.map((point, i) => (
            <circle
              cx={point.x}
              cy={point.y}
              fill={pumpkin}
              key={`radar-point-${i}`}
              r={2}
            />
          ))}
        </Group>
        <rect
          fill={background}
          height={height}
          onMouseLeave={hideTooltip}
          onMouseMove={handleMouseMove}
          rx={14}
          width={width}
        />
      </svg>
      {isTooltipVisible ? (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          left={tooltipLeft}
          top={tooltipTop}
        >
          {tooltipRender(data[tooltipData.index]!)}
        </TooltipWithBounds>
      ) : null}
    </>
  );
}
