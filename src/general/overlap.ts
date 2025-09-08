import type { Box } from "rabbit-ear/types.js";
import { includeS } from "rabbit-ear/math/compare.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { subtract2 } from "rabbit-ear/math/vector.js";

export const pointInRect2 = (p: [number, number], rect: Box) =>
  p[0] > rect.min[0] &&
  p[0] < rect.max[0] &&
  p[1] > rect.min[1] &&
  p[1] < rect.max[1];

export const pointInRect3 = (p: [number, number, number], rect: Box) =>
  p[0] > rect.min[0] &&
  p[0] < rect.max[0] &&
  p[1] > rect.min[1] &&
  p[1] < rect.max[1] &&
  (p[2] > rect.min[2] || rect.min[2] === undefined) &&
  (p[2] < rect.max[2] || rect.max[2] === undefined);

export const segmentBoxOverlap = (segment: [[number, number], [number, number]], box: Box) => {
  const line = {
    vector: subtract2(segment[1], segment[0]),
    origin: segment[0],
  };
  const polygon: [number, number][] = [
    box.min as [number, number],
    [box.max[0], box.min[1]],
    box.max as [number, number],
    [box.min[0], box.max[1]],
  ];
  const boxLines = polygon
    .map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
    .map((seg) => ({
      vector: subtract2(seg[1] as [number, number], seg[0] as [number, number]),
      origin: seg[0],
    }));
  const segmentIntersects = boxLines.map(
    (boxLine) => intersectLineLine(line, boxLine, includeS, includeS).point !== undefined,
  );
  return segmentIntersects.includes(true) ? true : pointInRect2(segment[0], box);
};

// https://rosettacode.org/wiki/Ray-casting_algorithm
const west = (p: [number, number], q: [number, number], point: [number, number]): boolean => {
  if (p[1] > q[1]) { return west(q, p, point); }
  // q's Y is larger than or equal to p's Y
  if (point[1] <= p[1] || point[1] > q[1] || point[0] >= p[0] && point[0] >= q[0]) {
    return false;
  } else if (point[0] < p[0] && point[0] < q[0]) {
    return true;
  } else {
    return (point[1] - p[1]) / (point[0] - p[0]) > (q[1] - p[1]) / (q[0] - p[0]);
  }
};

export const pointInPolygon = (
  point: [number, number],
  polygon: [number, number][],
): boolean => polygon
  .map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
  .map(([p, q]) => west(p, q, point))
  .map(crossed => crossed ? 1 : 0 as number)
  .reduce((a, b) => a + b, 0) % 2 === 1;

