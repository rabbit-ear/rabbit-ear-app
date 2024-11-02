import type { Model } from "./Model.ts";

/**
 * @description Get the vertices_faces (for every vertex, the adjacent faces)
 * given an already initialized Origami Simulator model.
 * Note: this is not the FOLD vertices_faces array. Conceptually this is,
 * but build using the Origami Simulator Model type as input.
 */
export const verticesFaces = (model: Model): number[][] => {
  const vertices_faces: number[][] = model.nodes.map(() => []);
  // iterate over every face, then iterate over each of the face's vertices
  model.fold.faces_vertices.forEach((face, f) => {
    // in the case that one face visits the same vertex multiple times,
    // this hash acts like a set and only allow one of each vertex index.
    const hash: number[] = [];
    face.forEach((vertex: number) => {
      hash[vertex] = f;
    });
    hash.forEach((fa, v) => vertices_faces[v].push(fa));
  });
  return vertices_faces;
};
