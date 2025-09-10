import type { VecLine2 } from "rabbit-ear/types.js";
import { EPSILON } from "rabbit-ear/math/constant.js";
import { includeL } from "rabbit-ear/math/compare.js";
import {
  magnitude2,
  normalize2,
  cross2,
  scale2,
  add2,
} from "rabbit-ear/math/vector.js";

/**
 * @description Find the intersection of two lines. Lines can be
 * lines/rays/segments, and can be inclusive or exclusive in terms
 * of their endpoints and the epsilon value.
 * @param {VecLine2} a line object with "vector" and "origin"
 * @param {VecLine2} b line object with "vector" and "origin"
 * @param {Function} [aDomain=includeL] the domain of the first line
 * @param {Function} [bDomain=includeL] the domain of the second line
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {[number, number][]} an array of 0, 1, or 2 points
 */
export const intersectLineLine = (
  a: VecLine2,
  b: VecLine2,
  aDomain = includeL,
  bDomain = includeL,
  epsilon = EPSILON,
): [number, number][] => {
  // a normalized determinant gives consistent values across all epsilon ranges
  const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));

  // lines are parallel
  if (Math.abs(det_norm) < epsilon) { return []; }

  const determinant0 = cross2(a.vector, b.vector);
  const determinant1 = -determinant0;

  const a2b: [number, number] = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];

  const b2a: [number, number] = [-a2b[0], -a2b[1]];
  const t0 = cross2(a2b, b.vector) / determinant0;
  const t1 = cross2(b2a, a.vector) / determinant1;

  if (
    aDomain(t0, epsilon / magnitude2(a.vector)) &&
    bDomain(t1, epsilon / magnitude2(b.vector))
  ) {
    return [add2(a.origin, scale2(a.vector, t0))];
  }
  return [];
};

