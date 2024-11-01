import type { Crease } from "./simulator/Crease.ts";

type FOLDFrame = {
  frame_author?: string;
  frame_title?: string;
  frame_description?: string;
  frame_classes?: string[];
  frame_attributes?: string[];
  frame_unit?: string;
  vertices_coords?: [number, number][] | [number, number, number][];
  vertices_vertices?: number[][];
  vertices_edges?: number[][];
  vertices_faces?: (number | null | undefined)[][];
  edges_vertices?: [number, number][];
  edges_faces?: (number | null | undefined)[][];
  edges_assignment?: string[];
  edges_foldAngle?: number[];
  edges_length?: number[];
  faces_vertices?: number[][];
  faces_edges?: number[][];
  faces_faces?: (number | null | undefined)[][];
  faceOrders?: [number, number, number][];
  edgeOrders?: [number, number, number][];
};

type FOLDChildFrame = FOLDFrame & {
  frame_parent?: number;
  frame_inherit?: boolean;
};

type FOLDFileMetadata = {
  file_frames?: FOLDChildFrame[];
  file_spec?: number;
  file_creator?: string;
  file_author?: string;
  file_title?: string;
  file_description?: string;
  file_classes?: string[];
};

export type FOLD = FOLDFileMetadata & FOLDFrame;

// FOLDMesh, a special type of a FOLD that is only concerned with rendering,
// vertices are required to be 3D, and certain fields are required.
//type FOLDMeshFrame = {
export type FOLDMesh = {
  vertices_coords: [number, number, number][];
  edges_vertices: [number, number][];
  edges_assignment: string[];
  edges_foldAngle: number[];
  faces_vertices: number[][];
  faces_edges: number[][];
  vertices_vertices?: number[][];
  // both now needed inside of GPUMath initArrays()
  vertices_edges: number[][];
  // difference from FOLD spec, these do not contain null or undefined.
  vertices_faces: number[][];
  // this is needed to make creases
  edges_faces?: number[][],

  //edges_length?: number[];
  faces_backmap?: number[],
  faces_nextmap?: number[][],

  vertices_coordsInitial: [number, number, number][];
  // creases_ data is the imaginary perpendicular
  // to a folded edge that "pulls" two faces together
  creases: Crease[],
  //creases_edge: number[],
  //creases_faces: [number, number][],
  //creases_vertices: [number, number][],
  //// does the crease have a bend (1) or is fold angle 0 (0)?
  //crease_type: (0 | 1)[], // crease_bend: (0, 1)[]
  //crease_node_type: (0 | 1 | 2 | 3 | 4)[],
};

//export type FOLDMesh = FOLDFileMetadata & FOLDMeshFrame;

