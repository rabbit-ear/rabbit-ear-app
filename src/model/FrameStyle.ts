import type { FOLD } from "rabbit-ear/types.d.ts";
import { getDimensionQuick, isFoldedForm } from "rabbit-ear/fold/spec.js";

export type FrameStyle = {
  isFoldedForm: boolean;
  dimension: number;
  showVertices: boolean;
  transparentFaces: boolean;
};

export const makeFrameStyle = (graph: FOLD): FrameStyle => ({
  isFoldedForm: isFoldedForm(graph),
  dimension: getDimensionQuick(graph) ?? 2,
  showVertices:
    graph?.vertices_coords && !graph?.edges_vertices && !graph?.faces_vertices,
  transparentFaces: graph.faceOrders == null,
});

