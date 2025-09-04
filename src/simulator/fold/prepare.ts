/**
 * Created by amandaghassaei on 2/25/17.
 */
import type { FOLD } from "rabbit-ear/types.d.ts";
import type { FOLDMesh } from "../types.ts";
import triangulateFold from "./triangulateFold.ts";
import splitCuts from "./splitCuts.ts";
import removeRedundantVertices from "./removeRedundantVertices.ts";
import { boundingBox } from "./boundingBox.ts";
import {
  makeVerticesEdges,
  makeVerticesEdgesUnsorted,
  makeVerticesFacesUnsorted,
  makeVerticesVertices,
} from "./adjacentVertices.ts";
import { resize3 } from "../general/math.ts";
import { makeFacesEdgesFromVertices, makeEdgesFacesUnsorted } from "./edgesFaces.ts";

export type FOLDImportable = {
  vertices_coords: [number, number, number][];
  vertices_coordsInitial: [number, number, number][];
  edges_vertices: [number, number][];
  edges_assignment: string[];
  edges_foldAngle: number[];
  faces_vertices: number[][];
  // if they exist on the input FOLD, keep them
  vertices_vertices?: number[][] | undefined;
};

export type FOLDInProgress = FOLDImportable & {
  faces_edges?: number[][];
  vertices_vertices?: number[][];
  vertices_edges?: number[][];
  vertices_faces?: number[][];
  edges_faces?: number[][];
  faces_backmap?: number[];
  faces_nextmap?: number[][];
};

/**
 * @description convert the indices to values and values to indices,
 * grouping multiple results into an array
 */
const invertMap = (map: number[]): number[][] => {
  const invert: number[][] = [];
  map.forEach((value) => {
    invert[value] = [];
  });
  map.forEach((value, i) => {
    invert[value].push(i);
  });
  return invert;
};

/**
 * @description the relative fold angle in degrees for
 * all assignments that have a fold angle that is not 0.
 */
const assignmentFlatAngles: { [key: string]: number } = {
  M: -180,
  m: -180,
  V: 180,
  v: 180,
};

/**
 * @description make an edges_foldAngle array from a FOLD object
 * by referencing the edges_assignment. This results will assume
 * the mountain and valleys are flat-folded 180 degrees.
 */
const makeEdgesFoldAngle = ({ edges_assignment }: FOLD): number[] =>
  edges_assignment.map((a) => assignmentFlatAngles[a] || 0);

/**
 *
 */
const getImportableArrays = (fold: FOLD): FOLDImportable => {
  const { vertices_coords, vertices_vertices, edges_vertices, faces_vertices } = fold;
  let { edges_assignment, edges_foldAngle } = fold;
  const vertices_coords3D = vertices_coords.map(resize3);

  // one of these two fields is absolutely necessary.
  // if neither exist, set all creases to unassigned "U".
  if (!edges_assignment && !edges_foldAngle) {
    edges_assignment = edges_vertices.map(() => "U");
  }

  // we need edges_foldAngle, but we can infer it from edges_assignment
  // if edges_foldAngle does not exist, set it from edges_assignment
  if (edges_assignment && !edges_foldAngle) {
    edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
  }

  // make all edges_assignments uppercase
  edges_assignment = fold.edges_assignment.map((a) => a.toUpperCase());

  return {
    vertices_coords: vertices_coords3D,
    vertices_coordsInitial: vertices_coords3D,
    vertices_vertices,
    edges_vertices,
    edges_assignment,
    edges_foldAngle,
    faces_vertices,
  };
};

const fixCuts = (fold: FOLD, epsilon?: number): FOLD => {
  // find a nice epsilon for vertex merging, unless the user specified one.
  if (epsilon === undefined) {
    //const box = boundingBox({ vertices_coords });
    const box = boundingBox(fold);
    epsilon = 1e-4 * (box ? Math.max(...box.span) : 1);
  }

  if (!fold.vertices_vertices) {
    fold.vertices_vertices = makeVerticesVertices(fold);
  }
  fold.vertices_edges = makeVerticesEdges(fold);

  // this next step will invalidate:
  // vertices_vertices, vertices__edges, vertices_faces
  const {
    vertices_coords,
    edges_vertices,
    edges_assignment,
    edges_foldAngle,
    faces_vertices,
  } = splitCuts(fold);
  // removeRedundantVertices requires vertices_vertices
  const vertices_vertices = makeVerticesVertices(fold);

  // remove vertices that split edge
  return removeRedundantVertices(
    {
      vertices_coords,
      vertices_vertices,
      edges_vertices,
      edges_assignment,
      edges_foldAngle,
      faces_vertices,
    },
    epsilon,
  );
};

/**
 * @description prepare a FOLD object for the GPU, returning a copy.
 * (does not modify the input object)
 * - ensure vertices are 3D (converts 2D into 3D by setting z axis to 0)
 * - triangulate faces (changes # of faces, edges)
 * - turn each cut edge "C" into two boundary "B" edges.
 *
 * "epsilon" is used only for cutting "C" edges.
 *
 * This was refactored from globals.pattern.setFoldData, where the
 * second optional parameter was also used to run "returnCreaseParams".
 * This is changed, now simulator/index calls "returnCreaseParams" directly.
 */
export const prepare = (inputFOLD: FOLD, epsilon?: number): FOLDMesh => {
  // these fields are absolutely necessary
  if (!inputFOLD.vertices_coords || !inputFOLD.edges_vertices) {
    throw new Error("model must contain vertices_coords and edges_vertices");
  }

  // deep copy fields which we are able to import
  let foldClone: FOLDImportable = {
    vertices_coords: [],
    vertices_coordsInitial: [],
    edges_vertices: [],
    edges_assignment: [],
    edges_foldAngle: [],
    faces_vertices: [],
  };
  try {
    foldClone = structuredClone(getImportableArrays(inputFOLD));
  } catch (err) {
    console.log("simulator clone error");
    console.log(err);
  }
  const { vertices_coordsInitial } = foldClone;

  //const {
  //  vertices_coords,
  //  vertices_coordsInitial,
  //  edges_vertices,
  //  edges_assignment,
  //  edges_foldAngle,
  //  faces_vertices,
  //  // if they exist on the input FOLD, keep them
  //  vertices_vertices,
  //} = structuredClone(getImportableArrays(inputFOLD));

  // get the indices of every cut "C" edge.
  const cut_edge_indices = foldClone.edges_assignment
    .map((assign, i) => (assign === "C" ? i : undefined))
    .filter((a) => a !== undefined);
  const cutsExist = cut_edge_indices.length > 0;

  // if cut creases exist, convert them into boundaries
  // this may change the number of vertices and edges, but not faces
  const fold: FOLD = cutsExist ? fixCuts(foldClone, epsilon) : foldClone;

  // this may change the number of edges and faces, but not vertices
  const faces_backmap = triangulateFold(fold, true);
  // store a reference, for every face (new triangulated faces),
  // which face index from the original set did this face arise from?
  const faces_nextmap = invertMap(faces_backmap);

  // if any faces were just triangulated, we need to rebuild these anyway,
  // it's a safety measure to just rebuild these no matter what.
  const vertices_edges = makeVerticesEdgesUnsorted(fold);
  const vertices_faces = makeVerticesFacesUnsorted(fold);
  const faces_edges = makeFacesEdgesFromVertices(fold);
  const edges_faces = makeEdgesFacesUnsorted(fold);

  return {
    vertices_coords: fold.vertices_coords.map(resize3),
    vertices_coordsInitial,
    vertices_vertices: fold.vertices_vertices,
    vertices_edges,
    vertices_faces,
    edges_vertices: fold.edges_vertices,
    edges_faces,
    edges_assignment: fold.edges_assignment,
    edges_foldAngle: fold.edges_foldAngle,
    faces_vertices: fold.faces_vertices,
    faces_edges,
    faces_backmap,
    faces_nextmap,
  };
};
