import type { FOLD } from "../types.ts";

/**
 * @description Consider an array of arrays of indices to each be cyclical,
 * convert each inner array into pairs [i, (i+1) % length], and build map
 * that relates these pairs as a space-separated string to the index in the
 * top level array in which this pair resides.
 * @param {number[][]} array
 * @param {number[]} subsetIndices
 * @returns {{[key: string]: number}}
 */
const makePairsMap = (
  array: number[][],
  subsetIndices?: number[],
): { [key: string]: number } => {
  const map: { [key: string]: number } = {};
  const indices = !subsetIndices ? array.map((_, i) => i) : subsetIndices;
  indices.forEach((i) =>
    array[i]
      .map((_, j, arr) =>
        [0, 1]
          .map((offset) => (j + offset) % arr.length)
          .map((n) => arr[n])
          .join(" "),
      )
      .forEach((key) => {
        map[key] = i;
      }),
  );
  return map;
};

/**
 * @description Make an object which answers the question: "which edge
 * connects these two vertices?". This is accomplished by building an
 * object with keys containing vertex pairs (space separated string),
 * and the value is the edge index. This is bidirectional, so "7 15"
 * and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @param {number[]} [edges=undefined] a list of edge indices to be used,
 * if left empty, all edges will be used as input.
 * @returns {{[key: string]: number}} object mapping a space-separated
 * vertex pair to an edge index
 */
export const makeVerticesToEdge = (
  { edges_vertices = [] }: FOLD,
  edges?: number[],
): { [key: string]: number } => makePairsMap(edges_vertices, edges);
