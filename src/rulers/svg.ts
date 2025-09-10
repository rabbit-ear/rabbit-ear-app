import type { Ruler } from "./Ruler.ts";
import type { Point } from "./Point.svelte.ts";
import type { Circle } from "./Circle.svelte.ts";
import type { Line } from "./Line.svelte.ts";
import type { Ray } from "./Ray.svelte.ts";
import type { Segment } from "./Segment.svelte.ts";
import type { VecLine2 } from "rabbit-ear/types.js";
import { clipLineConvexPolygon } from "rabbit-ear/math/clip.js";
import { include, includeL, includeR, includeS } from "rabbit-ear/math/compare.js";

export const clipLineFuncInLargerViewport = (
  line: VecLine2,
  lineFn = includeL,
  viewBox: [number, number, number, number],
) => {
  const [x, y, w, h] = viewBox;
  const polygon: [number, number][] = [
    [x - w * 10, y - h * 10],
    [x + w * 11, y - h * 10],
    [x + w * 11, y + h * 11],
    [x - w * 10, y + h * 11],
  ];
  return clipLineConvexPolygon(polygon, line, include, lineFn);
};

const pointToSVG = (
  shape: Ruler,
  radius: number,
): { nodeName: string, attributes: object } | undefined => {
  const point: Point = shape as unknown as Point;
  return point.defined
    ? {
      nodeName: "circle", attributes: {
        cx: point.coords![0],
        cy: point.coords![1],
        r: radius,
        class: "point"
      }
    }
    : undefined;
};

const lineToSVG = (
  shape: Ruler,
  viewBox: [number, number, number, number],
  lineFn = includeL,
): { nodeName: string, attributes: object } | undefined => {
  const line: Line = shape as unknown as (Line | Ray | Segment);
  const segment: [[number, number], [number, number]] | undefined = line.defined
    ? clipLineFuncInLargerViewport(line, lineFn, viewBox)
    : undefined;
  return segment
    ? {
      nodeName: "line", attributes: {
        x1: segment[0][0],
        y1: segment[0][1],
        x2: segment[1][0],
        y2: segment[1][1],
      }
    }
    : undefined;
};

const circleToSVG = (
  shape: Ruler,
): { nodeName: string, attributes: object } | undefined => {
  const circle: Circle = shape as unknown as Circle;
  return circle.defined
    ? {
      nodeName: "circle", attributes: {
        cx: circle.origin![0],
        cy: circle.origin![1],
        r: circle.radius,
        class: "circle",
      }
    }
    : undefined;
};

export const shapeToSVGElement = (
  shape: Ruler,
  { viewBox, radius }: { viewBox: [number, number, number, number], radius: number },
): { nodeName: string, attributes: object } | undefined => {
  switch (shape.constructor.name) {
    case "Point": return pointToSVG(shape, radius);
    case "Line": return lineToSVG(shape, viewBox, includeL);
    case "Ray": return lineToSVG(shape, viewBox, includeR);
    case "Segment": return lineToSVG(shape, viewBox, includeS);
    case "Circle": return circleToSVG(shape);
    default: return undefined;
  }
}
