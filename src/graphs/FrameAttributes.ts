import type { FOLD } from "rabbit-ear/types.d.ts";
import { getDimensionQuick, isFoldedForm } from "rabbit-ear/fold/spec.js";

// FrameAttributes
export type FrameAttributes = {
  isFoldedForm: boolean;
  dimension: number;
  isAbstract: boolean;
  hasLayerOrder: boolean;
};

export const makeFrameAttributes = (graph: FOLD): FrameAttributes => ({
  isFoldedForm: isFoldedForm(graph),
  dimension: getDimensionQuick(graph) ?? 2,
  isAbstract:
    (graph?.vertices_coords && !graph?.edges_vertices && !graph?.faces_vertices) ?? false,
  hasLayerOrder: graph.faceOrders != null,
});

