import type { Box, FOLD } from "rabbit-ear/types.js";
import { getDimensionQuick } from "rabbit-ear/fold/spec.js";
import { pointInPolygon, pointInRect2, pointInRect3, segmentBoxOverlap } from "./overlap.ts";
import { makeFacesEdgesFromVertices } from "rabbit-ear/graph/make/facesEdges.js";

export type FOLDSelection = {
  vertices?: Set<number>;
  edges?: Set<number>;
  faces?: Set<number>;
};

export const getVerticesInRect = (graph: FOLD, rect: Box): Set<number> => {
  if (!graph || !rect || !graph.vertices_coords) {
    return new Set();
  }
  const dimensions = getDimensionQuick(graph);
  const verticesLookup = dimensions === 3
    ? graph.vertices_coords.map((p) => pointInRect3(p, rect))
    : graph.vertices_coords.map((p) => pointInRect2(p, rect));
  return new Set(verticesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
};

export const getEdgesInRectExclusive = (graph: FOLD, vertices: Set<number>): Set<number> => {
  if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
    return new Set();
  }
  // only if both vertices are inside the rect, edge is inside
  const edgesLookup = graph.edges_vertices
    .map(verts => verts.map(v => vertices.has(v))
      .reduce((a, b) => a && b, true));

  return new Set(edgesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
};

export const getEdgesInRectInclusive = (graph: FOLD, rect: Box, vertices: Set<number>): Set<number> => {
  if (!graph || !rect || !graph.vertices_coords || !graph.edges_vertices) {
    return new Set();
  }
  // if one or two points are inside, edge is inside
  const edgesLookup = graph.edges_vertices
    .map(verts => verts.map(v => vertices.has(v))
      .reduce((a, b) => a || b, false));

  // for all other edges, if the edge intersects the box, edge is inside
  graph.edges_vertices.forEach((verts, e) => {
    if (edgesLookup[e]) { return; }
    const segment = verts.map((v) => graph.vertices_coords![v]);
    // todo: not 3D capable
    edgesLookup[e] = segmentBoxOverlap(segment, rect);
  });

  return new Set(edgesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
};

export const getFacesInRectExclusive = (
  graph: FOLD,
  vertices: Set<number>,
): Set<number> => {
  if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
    return new Set();
  }
  // if all of a face's vertices are inside, face is inside
  const facesLookup = graph.faces_vertices
    .map(verts => verts.map(v => vertices.has(v))
      .reduce((a, b) => a && b, true));

  return new Set(facesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
};

export const getFacesInRectInclusive = (
  graph: FOLD,
  rect: Box,
  vertices: Set<number>,
  edges: Set<number>,
): Set<number> => {
  if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
    return new Set();
  }
  const faces_edges = graph.faces_edges ? graph.faces_edges : makeFacesEdgesFromVertices(graph);

  // if any one of a face's points are inside, face is inside
  const facesLookup = graph.faces_vertices
    .map(verts => verts.map(v => vertices.has(v))
      .reduce((a, b) => a || b, false));

  // if any one of a face's edges are inside, face is inside
  faces_edges.forEach((faceEdges, f) => {
    if (facesLookup[f]) { return; }
    for (let i = 0; i < faceEdges.length; i++) {
      if (edges.has(faceEdges[i])) {
        facesLookup[f] = true;
        return;
      }
    }
  });

  // one more test: if the box is fully inside of a face
  graph.faces_vertices.forEach((verts, f) => {
    if (facesLookup[f]) { return; }
    const polygon = verts.map(v => graph.vertices_coords![v]);
    if (pointInPolygon(rect.min, polygon)) { facesLookup[f] = true; }
  });

  return new Set(facesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
}

export const getComponentsInRectExclusive = (graph: FOLD, rect: Box): FOLDSelection => {
  const vertices = getVerticesInRect(graph, rect);
  const edges = getEdgesInRectExclusive(graph, vertices);
  const faces = getFacesInRectExclusive(graph, vertices);
  return { vertices, edges, faces };
}

export const getComponentsInRectInclusive = (graph: FOLD, rect: Box): FOLDSelection => {
  const vertices = getVerticesInRect(graph, rect);
  const edges = getEdgesInRectInclusive(graph, rect, vertices);
  const faces = getFacesInRectInclusive(graph, rect, vertices, edges);
  return { vertices, edges, faces };
}

