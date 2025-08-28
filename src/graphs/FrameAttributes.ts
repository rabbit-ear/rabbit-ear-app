import type { FOLDChildFrame } from "rabbit-ear/types.d.ts";
import {
  getDimensionQuick,
  isFoldedForm as IsFoldedForm,
  edgesFoldAngleAreAllFlat,
} from "rabbit-ear/fold/spec.js";

// FrameAttributes
export type FrameAttributes = {
  // as best as we can tell quickly, is the graph a folded form?
  isFoldedForm: boolean;

  // as best as we can tell quickly, is the graph a crease pattern?
  isCreasePattern: boolean;

  // what dimension (2D or 3D) are the vertices?
  dimension: number;

  // // when folded (this may still be a crease pattern), is the model flat?
  // edgesAreFlat: boolean;

  // does the graph have vertices but no edges and no faces?
  isAbstract: boolean;

  // does the graph contain faceOrders (layer information between faces)
  hasLayerOrder: boolean;

  // is this frame a parent to any other frames in the FOLD file?-
  // child frames which inherit from this parent frame?
  isParent: boolean;

  // is this a child frame which inherits from some other frame in this file?
  inherits: boolean;
};

export const makeFrameAttributes = (graph: FOLDChildFrame): FrameAttributes => {
  const isFoldedForm = IsFoldedForm(graph);
  const dimension = getDimensionQuick(graph) ?? 2;
  // const edgesAreFlat = edgesFoldAngleAreAllFlat(graph);
  const isAbstract = (graph?.vertices_coords
    && !graph?.edges_vertices
    && !graph?.faces_vertices) ?? false;
  return {
    isFoldedForm,
    isCreasePattern: !isFoldedForm,
    dimension,
    // edgesAreFlat,
    isAbstract,
    hasLayerOrder: graph.faceOrders != null,
    isParent: graph["ear:isParent"] != null,
    inherits: graph.frame_inherit != null,
  };
};

export const makeFrameAttributes2 = (source: FOLDChildFrame, baked: FOLD): FrameAttributes => {
  const isFoldedForm = IsFoldedForm(source);
  const dimension = getDimensionQuick(baked) ?? 2;
  // const edgesAreFlat = edgesFoldAngleAreAllFlat(graph);
  const isAbstract = (baked?.vertices_coords
    && !baked?.edges_vertices
    && !baked?.faces_vertices) ?? false;
  return {
    isFoldedForm,
    isCreasePattern: !isFoldedForm,
    dimension,
    // edgesAreFlat,
    isAbstract,
    hasLayerOrder: baked.faceOrders != null,
    isParent: baked["ear:isParent"] != null,
    inherits: baked.frame_inherit != null,
  };
};

