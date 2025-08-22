import type { FOLD, FOLDMesh } from "../types.ts";

export type BoundingBox = {
  min: [number, number] | [number, number, number];
  max: [number, number] | [number, number, number];
  span: [number, number] | [number, number, number];
};

/**
 * @description Get an axis-aligned bounding box that encloses FOLD vertices.
 * the optional padding is used to make the bounding box inclusive / exclusive
 * by adding padding on all sides, or inset in the case of negative number.
 * (positive=inclusive boundary, negative=exclusive boundary)
 */
export const boundingBox = (
  { vertices_coords }: FOLD,
  padding: number = 0,
): BoundingBox | undefined => {
  if (!vertices_coords || !vertices_coords.length) {
    return undefined;
  }
  const coord0: [number, number] | [number, number, number] = vertices_coords[0];
  const min = Array(coord0.length).fill(Infinity) as
    | [number, number]
    | [number, number, number];
  const max = Array(coord0.length).fill(-Infinity) as
    | [number, number]
    | [number, number, number];

  vertices_coords.forEach((point) =>
    point.forEach((c, i) => {
      if (c < min[i]) {
        min[i] = c - padding;
      }
      if (c > max[i]) {
        max[i] = c + padding;
      }
    }),
  );
  const span = max.map((m, i) => m - min[i]) as
    | [number, number]
    | [number, number, number];
  return { min, max, span };
};

/**
 * @description Get the center of the bounding box of the model.
 * @param {Model} model
 */
export const getFOLDCenter = (fold: FOLDMesh): [number, number, number] => {
  if (!fold.vertices_coords) {
    return [0, 0, 0];
  }
  const min = Array(3).fill(Infinity);
  const max = Array(3).fill(-Infinity);
  for (let i = 0; i < fold.vertices_coords.length; i += 3) {
    for (let dim = 0; dim < 3; dim += 1) {
      min[dim] = Math.min(min[dim], fold.vertices_coords[i][dim]);
      max[dim] = Math.max(max[dim], fold.vertices_coords[i][dim]);
    }
  }
  return [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
};
