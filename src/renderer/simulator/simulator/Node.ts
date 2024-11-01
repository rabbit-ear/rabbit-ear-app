/**
 * Created by ghassaei on 9/16/16.
 */
import type { Edge } from "./Edge.ts";
import type { Crease } from "./Crease.ts";

export type Node = {
  // this is moved to fold.vertices_coordsInitial
  originalPosition: [number, number, number];
  index: number;
  // Beams are edges_ (edges_vertices)
  edges: Edge[]; // vertices_edges
  // Creases are their own thing. they are not edges
  creases: Crease[]; // vertices_creases
  // invCreases is
  // edge.nodes.forEach((node) => node.invCreases.push(this));
  // edges_vertices.forEach(v => v.invCreases.push(this beam))
  //
  // every crease has an edge. for each crease's edge, for this
  // edge's nodes, that node's invCreases is this edge
  invCreases: Crease[];
  externalForce: [number, number, number];
  fixed: boolean;
  simMass: number;
};

/**
 * @param {[number, number, number]} coords the node's coordinates
 * @param {number} index the index of the node in the model
 * @returns {SimulatorNode}
 */
export const makeNode = (
  [x, y, z]: [number, number, number],
  index: number,
): Node => ({
  originalPosition: [x, y, z],
  index: index,

  edges: [],
  creases: [],
  invCreases: [],
  externalForce: [0, 0, 0],
  fixed: false,
  simMass: 1,
});

/**
 * @param {SimulatorNode} node
 */
export const destroyNode = (node: Node) => {
  node.edges = [];
  node.creases = [];
  node.invCreases = [];
};
