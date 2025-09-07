import type { Box, FOLD } from "rabbit-ear/types.js";
import { includeS } from "rabbit-ear/math/compare.js";
import { intersectLineLine } from "rabbit-ear/math/intersect.js";
import { subgraph, subgraphExclusive } from "rabbit-ear/graph/subgraph.js";
import { filterKeysWithPrefix, filterKeysWithSuffix } from "rabbit-ear/fold/spec.js";

export type FOLDSelection = {
  // vertices?: number[];
  // edges?: number[];
  // faces?: number[];
  vertices?: Set<number>;
  edges?: Set<number>;
  faces?: Set<number>;
};

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

export const getComponentsInsideRect = (graph: FOLD, rect: Box): FOLDSelection => {
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

export const getSubgraph = (graph: FOLD, selection: FOLDSelection): FOLD => {
  try {
    return subgraph(graph, selection);
    return subgraphExclusive(graph, selection);
  } catch {
    return {};
  }
};

export const simpleSubgraph = (graph: FOLD, selection: FOLDSelection): FOLD => {
  const lookup: {
    vertices: { [key: string]: boolean },
    edges: { [key: string]: boolean },
    faces: { [key: string]: boolean },
  } = { vertices: {}, edges: {}, faces: {} };
  // add vertices to the lookup table, all vertices from
  // vertices, edges' edges_vertices, and faces' faces_vertices.
  selection.vertices?.forEach((v) => {
    lookup.vertices[v] = true;
  });
  selection.edges?.forEach((e) => {
    lookup.edges[e] = true;
  });
  // selection.edges?.forEach((edge) =>
  // 	graph.edges_vertices[edge].forEach((v) => {
  // 		lookup.vertices[v] = true;
  // 	}),
  // );
  selection.faces?.forEach((f) => {
    lookup.faces[f] = true;
  });
  // selection.faces?.forEach((face) =>
  // 	graph.faces_vertices[face].forEach((v) => {
  // 		lookup.vertices[v] = true;
  // 	}),
  // );

  const components = Object.keys(selection);
  // create a lookup which will be used when a component is a suffix
  // and we need to filter out elements which don't appear in other arrays
  const keys = {};
  components.forEach((c) => {
    filterKeysWithPrefix(graph, c).forEach((key) => {
      keys[key] = {};
    });
    filterKeysWithSuffix(graph, c).forEach((key) => {
      keys[key] = {};
    });
  });
  components.forEach((c) => {
    filterKeysWithPrefix(graph, c).forEach((key) => {
      keys[key].prefix = c;
    });
    filterKeysWithSuffix(graph, c).forEach((key) => {
      keys[key].suffix = c;
    });
  });

  const copy: FOLD = {};
  Object.keys(keys).forEach((key) => {
    copy[key] = [];
  });
  Object.keys(keys).forEach((key) => {
    const { prefix, suffix } = keys[key];
    // if prefix exists, filter outer array elements (creating holes)
    // if suffix exists, filter inner elements using the quick lookup
    if (prefix && suffix) {
      selection[prefix].forEach((i) => {
        copy[key][i] = graph[key][i].filter((j) => lookup[suffix][j]);
      });
    } else if (prefix) {
      selection[prefix].forEach((i) => {
        copy[key][i] = graph[key][i];
      });
    } else if (suffix) {
      copy[key] = graph[key].map((arr) => arr.filter((j) => lookup[suffix][j]));
    } else {
      copy[key] = graph[key];
    }
  });
  return copy;
};

