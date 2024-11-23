import type { FOLD } from "rabbit-ear/types.d.ts";
import { getDimensionQuick, isFoldedForm } from "rabbit-ear/fold/spec.js";

export type ModelStyle = {
  isFoldedForm: boolean;
  dimension: number;
  showVertices: boolean;
  transparentFaces: boolean;
};

export const makeModelStyle = (graph: FOLD): ModelStyle => ({
  isFoldedForm: isFoldedForm(graph),
  dimension: getDimensionQuick(graph),
  showVertices:
    graph?.vertices_coords && !graph?.edges_vertices && !graph?.faces_vertices,
  transparentFaces: graph.faceOrders == null,
});
