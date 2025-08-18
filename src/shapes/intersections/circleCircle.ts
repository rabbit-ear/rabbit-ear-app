import { EPSILON } from "rabbit-ear/math/constant.js";

const acosSafe = (x: number): number => {
  if (x >= 1.0) return 0;
  if (x <= -1.0) return Math.PI;
  return Math.acos(x);
};

const rotateVector2 = (center: [number, number], pt: [number, number], a: number): [number, number] => {
  const x = pt[0] - center[0];
  const y = pt[1] - center[1];
  const xRot = x * Math.cos(a) + y * Math.sin(a);
  const yRot = y * Math.cos(a) - x * Math.sin(a);
  return [center[0] + xRot, center[1] + yRot];
};

/**
 * @description calculate the intersection of two circles, resulting
 * in either no intersection, or one or two points.
 * @param {Circle} c1 circle in "radius" "origin" form
 * @param {Circle} c2 circle in "radius" "origin" form
 * @param {function} [circleDomain=include] the inclusivity of
 * the first circle parameter (currently not used).
 * @param {function} [circleDomain=include] the inclusivity of
 * the second circle parameter (currently not used).
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]|undefined} an array of one or two points, or undefined if no intersection
 * @linkcode Math ./src/intersect/intersect.js 121
 */
export const intersectCircleCircle = (
  c1: { origin: [number, number], radius: number },
  c2: { origin: [number, number], radius: number },
  epsilon: number = EPSILON,
): [number, number][] => {
  // sort by largest-smallest radius
  const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
  const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
  const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
  const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;

  // this is also the starting vector to rotate around the big circle
  const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
  const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));

  // infinite solutions // don't need this because the below case covers it
  // if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
  // no intersection (same center, different size)
  if (d < epsilon) { return []; }
  const point = vec.map((v, i) => (v / d) * R + bgCenter[i]) as [number, number];

  // kissing circles
  if (Math.abs((R + r) - d) < epsilon
    || Math.abs(R - (r + d)) < epsilon) { return [point]; }

  // circles are contained
  if ((d + r) < R || (R + r < d)) { return []; }
  const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
  const pt1 = rotateVector2(bgCenter, point, +angle);
  const pt2 = rotateVector2(bgCenter, point, -angle);
  return [pt1, pt2];
};

