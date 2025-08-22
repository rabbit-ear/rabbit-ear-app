import type { FOLDMesh } from "../types.ts";

type CreaseParam = {
  faces: [number, number];
  vertices: [number, number];
  edge: number;
  foldAngle: number;
};

const creaseAssignments: { [key: string]: boolean } = {
  M: true,
  V: true,
  F: true,
  J: true,
  m: true,
  v: true,
  f: true,
  j: true,
};

export const makeCreasesParams = (fold: FOLDMesh): CreaseParam[] => {
  const result: (CreaseParam | undefined)[] = fold.edges_faces.map((faces, edge) => {
    const [v1, v2] = fold.edges_vertices[edge];
    if (faces.length !== 2) {
      return undefined;
    }
    if (!creaseAssignments[fold.edges_assignment[edge]]) {
      return undefined;
    }
    // this is the face vertex across from the edge
    const vertices = faces.map((face) =>
      fold.faces_vertices[face].filter((v) => v !== v1 && v !== v2).shift(),
    );
    // we might need to flip the order... for some reason I still don't know
    const v1Index = fold.faces_vertices[faces[1]].indexOf(v1);
    const v2Index = fold.faces_vertices[faces[1]].indexOf(v2);
    const flipOrder = v2Index - v1Index === 1 || v2Index - v1Index === -2;
    return {
      faces: flipOrder ? [faces[1], faces[0]] : [faces[0], faces[1]],
      vertices: flipOrder ? [vertices[1], vertices[0]] : [vertices[0], vertices[1]],
      edge,
      foldAngle: fold.edges_foldAngle[edge],
    };
  });
  return result.filter((a) => a !== undefined);
};
