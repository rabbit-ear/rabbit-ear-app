import type { VecLine2 } from "rabbit-ear/types.js";
import { distance2 } from "rabbit-ear/math/vector.js";
import { nearestPointOnLine } from "rabbit-ear/math/nearest.js";
import { overlapLinePoint } from "rabbit-ear/math/overlap.js";

export type SnapResultNew = {
  coords: [number, number] | undefined;
  dist: number;
};

export type SnapResult = {
  coords: [number, number] | undefined;
  snap: boolean;
};

export type LineType = {
  line: VecLine2;
  clamp: (a: number) => number;
  domain: (_: number, __?: number) => boolean;
};

/**
 * @description Snap a point to either one point from a list of points
 * or to a grid-line point if either is within the range specified
 * by a snap radius.
 * @param {[number, number]} point the point we want to snap
 * @param {number[][]} points a list of snap points to test against
 * @param {number} snapRadius the epsilon range, any points outside
 * this will be ignored.
 * @returns {object} object with coords {number[]} and snap {boolean}
 */
export const snapToPointOrGrid = (
  point: [number, number],
  snapRadius: number,
  points: [number, number][],
  gridSnapFunction: (p: [number, number], r: number) => [number, number] | undefined,
): SnapResult => {
  // console.log("snapToPoint", point, points, snapRadius);
  if (!point) {
    return { coords: undefined, snap: false };
  }
  if (!points || !points.length) {
    const grid = gridSnapFunction(point, snapRadius);
    return grid !== undefined
      ? { coords: grid, snap: true }
      : { coords: point, snap: false };
  }

  // these points take priority over grid points.
  const pointsDistance = points.map((p) => distance2(p, point));
  const nearestPointIndex = pointsDistance
    .map((d, i) => (d < snapRadius ? i : undefined))
    .filter((a) => a !== undefined)
    .sort((a, b) => pointsDistance[a] - pointsDistance[b])
    .shift();

  // if a point exists within our snap radius, use that
  if (nearestPointIndex !== undefined) {
    return { coords: [...points[nearestPointIndex]], snap: true };
  }

  // fallback, use a grid point if it exists.
  // we only need the nearest of the grid coordinates.
  const grid = gridSnapFunction(point, snapRadius);
  if (grid !== undefined) {
    return { coords: grid, snap: true };
  }
  // fallback, return the input point.
  return { coords: [...point], snap: false };
};

/**
 *
 */
export const snapToLineOrPointOrGrid = (
  point: [number, number],
  snapRadius: number,
  lines: LineType[],
  points: [number, number][],
  gridSnapFunction: (p: [number, number], r: number) => [number, number] | undefined,
): SnapResult => {
  // for a line:
  // clamp: a => a,
  // domain: () => true,

  if (!point) {
    return { coords: undefined, snap: false };
  }
  if (!lines || !lines.length) {
    return { coords: point, snap: false };
  }

  // for each ruler, a point that is the nearest point on the line
  const rulersPoints = lines.map(
    (el) => nearestPointOnLine(el.line, point, el.clamp) as [number, number],
  );
  // for each ruler point, the distance to our input point
  const distances = rulersPoints.map((p) => distance2(point, p));
  // find the nearest point
  let index = 0;
  for (let i = 1; i < distances.length; i += 1) {
    if (distances[i] < distances[index]) {
      index = i;
    }
  }

  const ruler = lines[index];
  const rulerPoint = rulersPoints[index];
  // even if our goal is simply to snap to a ruler line, there may be a
  // snap point that lies along the nearest snapping ruler.
  // it's a snap within a snap behavior which, once you see, UX-wise,
  // it's a behavior that a user would expect to receive.
  // Now that we have found the nearest snap line, this is a subset of
  // snapPoints which overlap this snap line.
  const collinearSnapPoints = points.filter((p) =>
    overlapLinePoint(ruler.line, p, ruler.domain),
  );
  const snapPoint = snapToPointOrGrid(
    rulerPoint,
    snapRadius,
    collinearSnapPoints,
    gridSnapFunction,
  );
  const snapPointOverlaps =
    snapPoint.coords && overlapLinePoint(ruler.line, snapPoint.coords, ruler.domain);
  return snapPoint.snap && snapPointOverlaps
    ? snapPoint
    : { coords: rulerPoint, snap: true };
};

