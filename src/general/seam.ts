import type { FOLD } from "rabbit-ear/types.js";
import type { FOLDSelection } from "./selection";
import { makeFacesFaces } from "rabbit-ear/graph/make/facesFaces.js";
import { makeEdgesFacesUnsorted } from "rabbit-ear/graph/make/edgesFaces.js";

export const getSelectionSeamEdges = (graph: FOLD, selection: FOLDSelection): Set<number> => {
  if (!graph.edges_vertices || !graph.faces_vertices || !selection.faces) { return new Set(); }
  const edges_faces = makeEdgesFacesUnsorted(graph)
    .map(faces => faces.filter(a => a != null));
  const faces_faces = makeFacesFaces(graph)
    .map(faces => faces.filter(a => a != null));

  graph.edges_faces = edges_faces;
  graph.faces_faces = faces_faces;

  const facePairEdgeLookup: { [key: string]: number } = {};
  edges_faces.forEach((faces, edge) => {
    if (faces.length === 2) {
      facePairEdgeLookup[faces.sort((a, b) => a - b).join(" ")] = edge;
    }
  });

  // for every face, is it included inside the selection
  const faceIncluded = graph.faces_vertices
    .map((_, f) => selection.faces!.has(f));

  const seamEdges: Set<number> = new Set();
  faces_faces.forEach((faces, f1) => faces.forEach(f2 => {
    if (faceIncluded[f1] !== faceIncluded[f2]) {
      const key = [f1, f2].sort((a, b) => a - b).join(" ");
      const edge = facePairEdgeLookup[key];
      if (edge === undefined) { return; }
      seamEdges.add(edge);
    }
  }));
  return seamEdges;
};

export const getSelectionSeam = (graph: FOLD, selection: FOLDSelection): FOLDSelection => {
  if (!graph.edges_vertices) { return {}; }
  const edges = getSelectionSeamEdges(graph, selection);
  const vertices: Set<number> = new Set(Array.from(edges)
    .flatMap(edge => graph.edges_vertices![edge]));
  return { vertices, edges };
};

// modifies the graph in place
export const explodeAlongSeam = (graph: FOLD, selection: FOLDSelection): FOLDSelection => {
  delete graph.vertices_vertices;
  delete graph.vertices_edges;
  delete graph.vertices_faces;
  delete graph.edges_faces;
  delete graph.faces_edges;
  delete graph.faces_faces;

  const seam = getSelectionSeam(graph, selection);
  if (!graph.vertices_coords || !graph.edges_vertices) { return selection; }
  if (!seam.vertices || !seam.edges || !selection.edges) { return selection; }

  // const newVertices = Array.from(Array(seam.vertices.size))
  //   .map((_, i) => graph.vertices_coords!.length + i);
  const newVertices = Array.from(seam.vertices);

  // const nextMap: { [key: string]: number } = {};
  // const backMap: { [key: string]: number } = {};
  const vertexNextMap: number[] = graph.vertices_coords.map((_, i) => i);;
  const vertexBackMap: number[] = [];
  newVertices.forEach((v, i) => {
    vertexNextMap[v] = graph.vertices_coords!.length + i;
    vertexBackMap[graph.vertices_coords!.length + i] = v;
  });

  // console.log("v nextMap", vertexNextMap);
  // console.log("v backMap", vertexBackMap);

  vertexBackMap.forEach((oldI, newI) => {
    graph.vertices_coords![newI] = [...graph.vertices_coords![oldI]];
  });

  // edges
  const edgeNextMap: number[] = graph.edges_vertices.map((_, i) => i);
  const edgeBackMap: number[] = [];
  Array.from(seam.edges).forEach((e, i) => {
    edgeNextMap[e] = graph.edges_vertices!.length + i;
    edgeBackMap[graph.edges_vertices!.length + i] = e;
  });

  // console.log("e nextMap", edgeNextMap);
  // console.log("e backMap", edgeBackMap);

  const interiorEdges = selection.edges.difference(seam.edges);

  // most interior edges's vertices won't change, those which are interior
  // but with one vertex along the same will need to change. this is for them
  Array.from(interiorEdges).forEach(edge => {
    const verts = graph.edges_vertices![edge];
    graph.edges_vertices![edge] = [vertexNextMap[verts[0]], vertexNextMap[verts[1]]];
  });

  // the seam edges themselves need to be duplicated and added to the resulting selection
  edgeBackMap.forEach((oldI, newI) => {
    graph.edges_vertices![newI] = graph.edges_vertices![oldI]
      .map(v => vertexNextMap[v]) as [number, number];
  });

  // edge attributes
  if (graph.edges_assignment) {
    edgeBackMap.forEach((oldI, newI) => {
      graph.edges_assignment![newI] = graph.edges_assignment![oldI];
    });
  }

  if (graph.edges_foldAngle) {
    edgeBackMap.forEach((oldI, newI) => {
      graph.edges_foldAngle![newI] = graph.edges_foldAngle![oldI];
    });
  }

  if (selection.faces) {
    Array.from(selection.faces).forEach(face => {
      const verts = graph.faces_vertices![face];
      graph.faces_vertices![face] = verts.map(v => vertexNextMap[v]);
    });
  }

  // update the selection with the new components
  const result = {
    vertices: new Set(selection.vertices),
    edges: new Set(selection.edges),
    faces: new Set(selection.faces),
  };
  result.vertices.forEach(vert => {
    if (seam.vertices!.has(vert)) {
      result.vertices.delete(vert);
      result.vertices.add(vertexNextMap[vert]);
    }
  });
  vertexBackMap.forEach((_, newI) => result.vertices.add(newI));

  result.edges.forEach(edge => {
    if (seam.edges!.has(edge)) {
      result.edges.delete(edge);
      result.edges.add(edgeNextMap[edge]);
    }
  });

  edgeBackMap.forEach((_, newI) => result.edges.add(newI));

  // console.log("graph", graph);
  // console.log("result", result);

  delete graph.edges_faces;
  delete graph.faces_faces;

  return result;
};

// export const getSeamVertices = (graph: FOLD, selection: FOLDSelection): number[] => {
//   if (!selection.vertices) { return []; }
//   const vertices_vertices = makeVerticesVerticesUnsorted(graph);
//
//   // for every vertex, is it included inside the selection
//   const vertIncluded = vertices_vertices
//     .map((_, v) => selection.vertices!.has(v));
//
//   // for every vertex, wether it's included in the selection or not, doesn't matter,
//   // do all of its adjacent vertices match the same selection state as it?
//   const seamVertices = vertices_vertices
//     .map((verts, v0) => verts
//       .map(vA => selection.vertices!.has(vA))
//       .map(state => state === vertIncluded[v0])
//       .reduce((a, b) => a && b, true))
//     .map(res => !res);
//
//   return seamVertices
//     .map((seam, v) => seam ? v : undefined)
//     .filter(a => a !== undefined);
// }

