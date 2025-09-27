import type { FOLD, FOLDChildFrame } from "rabbit-ear/types.d.ts";
import { flattenFrame } from "rabbit-ear/fold/frames.js";
import { clone } from "rabbit-ear/general/clone.js";
import { normalize3 } from "rabbit-ear/math/vector.js";
import { makeFacesEdgesFromVertices } from "rabbit-ear/graph/make/facesEdges.js";

// modifies input list in place
export const prepareFOLDFrames = (frames: FOLDChildFrame[]): FOLDChildFrame[] => {
  // todo: unsure if this is necessary
  frames.forEach(frame => {
    delete frame.vertices_vertices;
    delete frame.vertices_edges;
    delete frame.vertices_faces;
    delete frame.edges_faces;
    delete frame.faces_edges;
    delete frame.faces_faces;
  });

  frames
    .filter(frame => frame.frame_inherit)
    .map(frame => frame.frame_parent)
    .filter(index => index !== undefined)
    .forEach(index => { frames[index]["ear:isParent"] = true });
  return frames;
};

/**
 * @description a FOLD object with frames is arranged such that
 * the top level is frame [0], and frames 1...N-1 are inside of
 * an array under the key "file_frames". This method converts
 * a flat array of frames into a FOLD object with "file_frames".
 */
export const reassembleFramesToFOLD = (frames: FOLDChildFrame[]): FOLD => {
  const fold = { ...frames[0] };
  const file_frames = frames.slice(1);
  if (file_frames.length) {
    fold.file_frames = file_frames;
  }
  return fold;
};

export const makeFlatFramesFromFrames = (frames: FOLDChildFrame[]): FOLD[] => {
  try {
    const fold = reassembleFramesToFOLD(frames);
    return frames.map((_, i) => {
      try {
        return flattenFrame(fold, i);
      } catch (errorFlatten) {
        console.log(errorFlatten);
        return {};
      }
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const flattenFrameInArray = (frames: FOLDChildFrame[], frameNumber = 0): FOLD => {
  if (!frames || frames.length < frameNumber) {
    return {};
  }

  // prevent cycles. never visit a frame twice
  const visited: { [key: number]: boolean } = {};

  /**
   * @description recurse from the desired frame up through its parent
   * frames until we reach frame index 0, or a frame with no parent.
   * @param {number} currentIndex
   * @param {number[]} previousOrders
   * @returns {number[]} a list of frame indices, from parent to child.
   */
  const recurse = (currentIndex: number, previousOrders: number[]): number[] => {
    // prevent cycles
    if (visited[currentIndex]) {
      // throw new Error(Messages.graphCycle);
      throw new Error("graph contains cycles");
    }
    visited[currentIndex] = true;

    // add currentIndex to the start of the list of previous frame indices
    const thisOrders = [currentIndex].concat(previousOrders);

    // get a reference to the current frame
    /** @type {FOLDInternalFrame} */
    const frame = frames[currentIndex];

    // if the frame inherits and contains a parent, recurse
    // if not, we are done, return the list of orders.
    return frame.frame_inherit && frame.frame_parent != null
      ? recurse(frame.frame_parent, thisOrders)
      : thisOrders;
  };

  // recurse, get a list of frame indices from parent to child,
  // convert the indices into shallow copies of the frames, and
  // sequentially reduce all frames into a single frame object.
  const flattened = recurse(frameNumber, [])
    .map((frameNum: number) => frames[frameNum])
    .reduce((a, b) => ({ ...a, ...b }));

  // todo: make sure if we don't clone, make sure nowhere is modifying.
  // or rather, make sure we're modifying the proper source.
  // this is optional, but this ensures that this method can be treated
  // "functionally" and using this method will not cause any side effects
  // return clone(flattened);
  return flattened;
};

export const makeVerticesFacesSimple = ({ vertices_coords, faces_vertices }: FOLD): number[][] => {
  const vertices_faces: number[][] = (vertices_coords ?? []).map(() => []);
  faces_vertices?.forEach((face, f) => {
    // in the case that one face visits the same vertex multiple times,
    // use a set to allow one occurence of each vertex index.
    const set: Set<number> = new Set();
    face.forEach((vertex) => set.add(vertex));
    set.forEach(v => vertices_faces[v].push(f));
  });
  return vertices_faces;
};

export const makeVerticesNormal = ({
  vertices_coords, faces_vertices, faces_normal
}: FOLD & { faces_normal: [number, number, number][] }) => {
  const vertices_normals: [number, number, number][] = (vertices_coords ?? []).map(() => [0, 0, 0]);

  faces_vertices?.forEach((vertices, f) =>
    vertices.forEach((v) => {
      vertices_normals[v][0] += faces_normal[f][0];
      vertices_normals[v][1] += faces_normal[f][1];
      vertices_normals[v][2] += faces_normal[f][2];
    }),
  );

  // normalize all summed vectors and return them
  return vertices_normals.map((v) => normalize3(v));
};

export const getFaceEdgeIsJoined = ({ edges_vertices, edges_assignment, faces_vertices, faces_edges }: FOLD): boolean[][] => {
  if (!faces_edges) { faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices }) };
  if (edges_assignment) {
    return faces_edges.map((edges) =>
      edges.map((e) => edges_assignment[e]).map((a) => a === "J" || a === "j"),
    );
  }
  return faces_vertices ? faces_vertices.map((arr) => arr.map(() => false)) : [];
};

export const getVerticesBarycentric = (vertices_coords3: [number, number, number][], facesEdgesIsJoined: boolean[][]) => {
  const vertices_barycentric: [number, number, number][] = vertices_coords3
    .map((_, i) => i % 3)
    .map((n) => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
  for (let i = 0; i < facesEdgesIsJoined.length; i += 1) {
    if (facesEdgesIsJoined[i][0]) {
      vertices_barycentric[i * 3 + 0][2] = vertices_barycentric[i * 3 + 1][2] = 100;
    }
    if (facesEdgesIsJoined[i][1]) {
      vertices_barycentric[i * 3 + 1][0] = vertices_barycentric[i * 3 + 2][0] = 100;
    }
    if (facesEdgesIsJoined[i][2]) {
      vertices_barycentric[i * 3 + 0][1] = vertices_barycentric[i * 3 + 2][1] = 100;
    }
  }
  return vertices_barycentric;
}

