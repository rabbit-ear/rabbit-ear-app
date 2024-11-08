import { subtract2 } from "rabbit-ear/math/vector.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { excludeS } from "rabbit-ear/math/compare.js";
import type { Shape } from "./shapes.ts";

const intersectLines = (a, b): [number, number] => {
  const lineA = {
    vector: subtract2([a.x2, a.y2], [a.x1, a.y1]),
    origin: [a.x1, a.y1],
  };
  const lineB = {
    vector: subtract2([b.x2, b.y2], [b.x1, b.y1]),
    origin: [b.x1, b.y1],
  };
  const { point } = intersectLineLine(lineA, lineB, excludeS, excludeS);
  return point;
};

export const intersectAllShapes = (shapes: Shape[]): [number, number][] => {
  const results: [number, number][] = [];
  for (let i = 0; i < shapes.length - 1; i += 1) {
    if (shapes[i].name !== "line") {
      continue;
    }
    for (let j = i + 1; j < shapes.length; j += 1) {
      if (shapes[j].name !== "line") {
        continue;
      }
      const result = intersectLines(shapes[i].params, shapes[j].params);
      if (result) {
        results.push(result);
      }
    }
  }
  return results;
};

// temporarily returns all circles, that's all.
//const getShapesInRect = (shapes: Shape[], rect): number[] => {
export const getShapesInRect = (shapes: Shape[]): number[] => {
  return shapes
    .map(({ name }, i) => (name === "circle" ? i : undefined))
    .filter((a) => a !== undefined);
};
