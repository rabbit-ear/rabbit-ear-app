import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { identity2x3 } from "rabbit-ear/math/matrix2.js";

export const graphToMatrix2 = (graph = {}, verticalUp = false): number[] => {
  const box = boundingBox(graph);
  // console.log("graphToMatrix2", box, graph, verticalUp);
  // no vertices
  if (!box || !box.span || !box.min) {
    return verticalUp ? [1, 0, 0, 1, 0, -1] : [...identity2x3];
  }
  // degenerate vertices
  const vmax = Math.max(box.span[0], box.span[1]);
  const padding = box.span.map((s) => (s - vmax) / 2);
  if (
    vmax < 1e-6 ||
    !isFinite(box.min[0]) ||
    !isFinite(box.min[1]) ||
    !isFinite(box.span[0]) ||
    !isFinite(box.span[1])
  ) {
    return verticalUp ? [1, 0, 0, 1, 0, -1] : [...identity2x3];
  }
  const translation = [0, 1].map((i) => box.min[i] + padding[i]);
  if (verticalUp) {
    translation[1] = -box.max[1] + padding[1];
  }
  return [vmax, 0, 0, vmax, translation[0], translation[1]];
};
