import { EPSILON } from "rabbit-ear/math/constant.js";
import { include, includeL } from "rabbit-ear/math/compare.js";
import {
  cross2,
  scale2,
  subtract2,
  rotate90,
} from "rabbit-ear/math/vector.js";

/**
 * @description Calculate the intersection of a circle and a line;
 * the line can be a line, ray, or segment.
 * @param {Circle} circle a circle in "radius" "origin" form
 * @param {VecLine2} line a line in "vector" "origin" form
 * @param {Function} [_=include] the inclusivity of
 * the circle boundary (currently not used).
 * @param {Function} [lineDomain=includeL] set the line/ray/segment
 * and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {[number, number][]} a list of 2D points
 */
export const intersectCircleLine = (
  circle: { origin: [number, number], radius: number },
  line: { vector: [number, number], origin: [number, number] },
  _ = include,
  lineDomain = includeL,
  epsilon = EPSILON,
): [number, number][] => {
  const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? line.vector : scale2(line.vector, 1 / mag);
  const rot90 = rotate90(norm);
  const bvec = subtract2(line.origin, circle.origin);
  const det = cross2(bvec, norm);
  if (Math.abs(det) > circle.radius + epsilon) {
    return [];
  }
  const side = Math.sqrt(circle.radius ** 2 - det ** 2);
  const f = (s: number, i: number) => circle.origin[i] - rot90[i] * det + norm[i] * s;
  const results: [number, number][] =
    Math.abs(circle.radius - Math.abs(det)) < epsilon
      ? [side].map((s) => [f(s, 0), f(s, 1)]) // tangent to circle
      : [-side, side].map((s) => [f(s, 0), f(s, 1)]);
  const ts = results
    .map((res) => res.map((n, i) => n - line.origin[i]))
    .map((v) => v[0] * line.vector[0] + line.vector[1] * v[1])
    .map((d) => d / magSq);
  return results.filter((__, i) => lineDomain(ts[i], epsilon));
};

