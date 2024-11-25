import type { FOLD } from "../types.ts";
import { makeVerticesToEdge } from "./lookup.ts";

/**
 * @description Make `faces_edges` from `faces_vertices`.
 * @param {FOLD} graph a FOLD object, with
 * edges_vertices and faces_vertices
 * @returns {number[][]} a `faces_edges` array
 */
export const makeFacesEdgesFromVertices = ({
  edges_vertices,
  faces_vertices,
}: FOLD): number[][] => {
  const map = makeVerticesToEdge({ edges_vertices });
  return faces_vertices
    .map((face) => face.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
    .map((face) => face.map((pair) => map[pair]));
};

/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is unsorted, prefer makeEdgesFaces()
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, faces_edges
 * @returns {(number | null | undefined)[][]} each entry relates
 * to an edge, each array contains indices
 * of adjacent faces.
 */
export const makeEdgesFacesUnsorted = ({
  edges_vertices,
  faces_vertices,
  faces_edges,
}: FOLD): (number | null | undefined)[][] => {
  // faces_vertices is only needed to build this array, if it doesn't exist.
  if (!faces_edges) {
    faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
  }
  // instead of initializing the array ahead of time (we would need to know
  // the length of something like edges_vertices)
  const edges_faces = edges_vertices.map(() => []);
  faces_edges.forEach((face, f) => {
    // in the case that one face visits the same vertex multiple times,
    // use a set to allow one occurence of each vertex index.
    const set = new Set();
    face.forEach((edge) => set.add(edge));
    set.forEach((e) => edges_faces[e].push(f));
  });

  return edges_faces;
};
