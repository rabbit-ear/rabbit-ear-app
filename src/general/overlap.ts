import type { Box, FOLD } from "rabbit-ear/types.js";
import { includeS } from "rabbit-ear/math/compare.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";

const pointInRect = (p: [number, number], rect: Box) =>
  p[0] > rect.min[0] &&
  p[0] < rect.max[0] &&
  p[1] > rect.min[1] &&
  p[1] < rect.max[1];

const segmentBoxOverlap = (segment: [[number, number], [number, number]], box: Box) => {
  const boxSegments = [
    [box.min, [box.max[0], box.min[1]]],
    [[box.max[0], box.min[1]], box.max],
    [box.max, [box.min[0], box.max[1]]],
    [[box.min[0], box.max[1]], box.min],
  ];
  const line = {
    vector: [segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]],
    origin: segment[0],
  };
  const boxVectors = boxSegments.map((seg) => [
    seg[1][0] - seg[0][0],
    seg[1][1] - seg[0][1],
  ]);
  const boxLines = boxVectors.map((vector, i) => ({
    vector,
    origin: boxSegments[i][0],
  }));
  const segmentIntersects = boxSegments.map(
    (seg, i) => intersectLineLine(line, boxLines[i], includeS, includeS).point,
  );
  const anySegmentIntersects = segmentIntersects.reduce(
    (a, b) => a || b,
    false,
  );
  if (anySegmentIntersects) {
    return true;
  }
  const ptInside = pointInRect(segment[0], box);
  return ptInside;
};

export const getComponentsInsideRect = (graph: FOLD, rect: Box) => {
  if (!graph || !rect) {
    return { vertices: [], edges: [], faces: [] };
  }
  if (
    !graph.vertices_coords ||
    !graph.edges_vertices ||
    (!graph.faces_vertices && !graph.faces_edges)
  ) {
    return { vertices: [], edges: [], faces: [] };
  }
  const verticesLookup = graph.vertices_coords.map((p) => pointInRect(p, rect));
  const vertices = verticesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined);
  const edgesLookup = graph.edges_vertices
    .map((ev) => ev.map((v) => graph.vertices_coords[v]))
    .map((segment) => segmentBoxOverlap(segment, rect));
  const edges = edgesLookup
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined);
  const faces = graph.faces_edges
    ? graph.faces_edges
      .map((fe) => fe.map((e) => edgesLookup[e]))
      .map((face) => face.reduce((a, b) => a || b, false))
      .map((sel, i) => (sel ? i : undefined))
      .filter((a) => a !== undefined)
    : graph.faces_vertices
      // const faces = graph.faces_vertices
      .map((fv) => fv.map((v) => verticesLookup[v]))
      .map((face) => face.reduce((a, b) => a || b, false))
      .map((sel, i) => (sel ? i : undefined))
      .filter((a) => a !== undefined);
  return { vertices, edges, faces };
};

