import type { VecLine2 } from "rabbit-ear/types.js";
import {
  include,
  includeL,
  //includeR,
  //includeS,
  //excludeS,
} from "rabbit-ear/math/compare.js";
import { clipLineConvexPolygon } from "rabbit-ear/math/clip.js";

export const clipLineInPolygon = (
  line: VecLine2,
  polygon: [number, number][],
): [number, number][] | undefined => {
  if (!line) {
    return undefined;
  }
  return clipLineConvexPolygon(polygon, line, include, includeL);
};

