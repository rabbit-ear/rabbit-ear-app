/**
 * Created by amandaghassaei on 5/6/17.
 */
import type { Model } from "./Model.ts";
import type { FOLD, FOLDMesh } from "../types.ts";

/**
 * @description Merge the new computed vertices coordinates back into
 * the original FOLD graph, update the edges_foldAngle to their current
 * fold angle as well, and if the user chooses, replace the faces with
 * their triangulated counterparts, creating additional "J" (join) edges.
 * @param {Model} model the OrigamiSimulator Model object
 * @param {FOLD} foldUnmodified a FOLD object, the original one loaded into the app.
 * @param {FOLD} foldTriangulated a FOLD object, the original input but modified
 * so that all faces are triangulated.
 * @param {{ triangulated?: boolean, angles?: boolean }} options
 */
export const exportFOLD = (
  model: Model,
  foldUnmodified: FOLD,
  foldTriangulated: FOLDMesh,
  { triangulated }: { triangulated?: boolean } = {},
  //{ triangulated, angles }: { triangulated?: boolean; angles?: boolean } = {},
): FOLD => {
  if (!model.positions || !foldUnmodified.vertices_coords) {
    triangulated = true;
  } else {
    const verticesMatch =
      model.positions?.length &&
      foldUnmodified.vertices_coords?.length &&
      foldUnmodified.vertices_coords.length === model.positions.length / 3;
    if (!verticesMatch) {
      triangulated = true;
      console.warn("vertex count mismatch. reverting to triangulated model");
    }
  }

  // shallow copy is good enough for this purpose
  const fold: FOLD = triangulated ? { ...foldTriangulated } : { ...foldUnmodified };
  fold.file_creator =
    "Origami Simulator: http://git.amandaghassaei.com/OrigamiSimulator/";
  fold.file_classes = ["singleModel"];
  fold.frame_classes = ["foldedForm"];
  fold.frame_attributes = ["3D"];
  fold.vertices_coords = (fold.vertices_coords || []).map(
    (_, i) =>
      [
        model.positions?.[i * 3 + 0] || 0,
        model.positions?.[i * 3 + 1] || 0,
        model.positions?.[i * 3 + 2] || 0,
      ] as [number, number, number],
  );
  // if (globals.exportFoldAngle) {
  // 	json.edges_foldAngle = fold.edges_foldAngle;
  // }
  return fold;
};
