import type { FOLD } from "rabbit-ear/types.js";
import type { FOLDSelection } from "./selection.ts";
import { subgraphExclusive } from "rabbit-ear/graph/subgraph.js";

const closedSubcomplex = (graph: FOLD, selection: FOLDSelection): FOLDSelection => {
  const lookup: {
    vertices: boolean[],
    edges: boolean[],
    faces: boolean[],
  } = { vertices: [], edges: [], faces: [] };
  selection.faces?.forEach((f) => {
    lookup.faces[f] = true;
  });

  if (graph.faces_vertices) {
    selection.faces?.forEach((face) =>
      graph.faces_vertices![face].forEach((v) => {
        lookup.vertices[v] = true;
      }));
  }

  if (graph.faces_edges) {
    selection.faces?.forEach((face) =>
      graph.faces_edges![face].forEach((e) => {
        lookup.edges[e] = true;
      }));
  }

  selection.edges?.forEach((e) => {
    lookup.edges[e] = true;
  });

  if (graph.edges_vertices) {
    selection.edges?.forEach((edge) =>
      graph.edges_vertices![edge]?.forEach((v) => {
        lookup.vertices[v] = true;
      }));
  }

  selection.vertices?.forEach((v) => {
    lookup.vertices[v] = true;
  });

  const vertices = new Set((lookup.vertices ?? [])
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
  const edges = new Set((lookup.edges ?? [])
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
  const faces = new Set((lookup.faces ?? [])
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
  return { vertices, edges, faces };
};

const closedSubgraph = (graph: FOLD, selection: FOLDSelection): FOLDSelection => {
  const lookup: {
    vertices: boolean[],
    edges: boolean[],
  } = { vertices: [], edges: [] };
  selection.edges?.forEach((e) => {
    lookup.edges[e] = true;
  });
  if (graph.edges_vertices) {
    selection.edges?.forEach((edge) =>
      graph.edges_vertices![edge]?.forEach((v) => {
        lookup.vertices[v] = true;
      }));
  }

  selection.vertices?.forEach((v) => {
    lookup.vertices[v] = true;
  });

  const vertices = new Set((lookup.vertices ?? [])
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
  const edges = new Set((lookup.edges ?? [])
    .map((sel, i) => (sel ? i : undefined))
    .filter((a) => a !== undefined));
  return { vertices, edges };
};

export const strictSubcomplex = (graph: FOLD, selection: FOLDSelection): FOLD => {
  const closedSelection = closedSubcomplex(graph, selection);
  return subgraphExclusive(graph, closedSelection);
};

export const strictSubgraph = (graph: FOLD, selection: FOLDSelection): FOLD => {
  const closedSelection = closedSubgraph(graph, selection);
  return subgraphExclusive(graph, closedSelection);
};

export const vertexSubgraph = (graph: FOLD, selection: FOLDSelection): FOLD => {
  const closedSelection = { vertices: selection.vertices ?? [] };
  return subgraphExclusive(graph, closedSelection);
};

