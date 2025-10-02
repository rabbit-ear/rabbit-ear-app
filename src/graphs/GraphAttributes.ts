import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import {
  getDimensionQuick,
  isFoldedForm as IsFoldedForm,
  edgesFoldAngleAreAllFlat,
} from "rabbit-ear/fold/spec.js";

export enum EmbeddingType {
  foldedForm = "foldedForm",
  creasePattern = "creasePattern",
};

export type GraphAttributes = {
  // as best as we can tell quickly, is the graph a folded form?
  class: EmbeddingType;

  // what dimension (2D or 3D) are the vertices?
  dimension: 2 | 3;

  // are the creases all flat (180deg) implying that the folded state should
  // also be flat? this does not imply that it is successfully flat-foldable.
  // edgesAreFlat: boolean;

  // does the graph have vertices but no edges and no faces?
  isAbstract: boolean;

  // does the graph contain faceOrders (layer information between faces)?
  // if the layer order is defined but empty, this counts as non-existent.
  hasLayerOrder: boolean;

  // is this frame a parent to any other frames in the FOLD file?-
  // child frames which inherit from this parent frame?
  // isParent: number[];
  isParent: boolean;

  hasParent: boolean;

  // is this a child frame which inherits from some other frame in this file?
  isChild: number | undefined;
};

// export const makeGraphAttributes = (graph: FOLDChildFrame): GraphAttributes => {
//   const isFoldedForm = IsFoldedForm(graph);
//   const dimension = getDimensionQuick(graph) ?? 2;
//   // const edgesAreFlat = edgesFoldAngleAreAllFlat(graph);
//   const isAbstract = (graph?.vertices_coords
//     && !graph?.edges_vertices
//     && !graph?.faces_vertices) ?? false;
//   return {
//     isFoldedForm,
//     isCreasePattern: !isFoldedForm,
//     dimension,
//     // edgesAreFlat,
//     isAbstract,
//     hasLayerOrder: graph.faceOrders != null,
//     isParent: graph["ear:isParent"] != null,
//     isChild: graph.frame_inherit != null,
//   };
// };

export const makeGraphAttributes = (source: FOLDChildFrame, baked: FOLD): GraphAttributes => {
  const isFoldedForm = IsFoldedForm(baked);
  const frameClass = isFoldedForm ? EmbeddingType.foldedForm : EmbeddingType.creasePattern;
  const dimension = getDimensionQuick(baked) as (2 | 3) ?? 2;
  // const edgesAreFlat = edgesFoldAngleAreAllFlat(graph);
  const isAbstract = (baked?.vertices_coords
    && !baked?.edges_vertices
    && !baked?.faces_vertices) ?? false;
  const hasLayerOrder = baked.faceOrders != null && baked.faceOrders.length !== 0;
  return {
    class: frameClass,
    dimension,
    // edgesAreFlat,
    isAbstract,
    hasLayerOrder,
    isParent: source["ear:isParent"] != null,
    hasParent: (source.frame_inherit && source.frame_parent != null) ?? false,
    isChild: source.frame_parent == null ? undefined : source.frame_parent,
  };
};

