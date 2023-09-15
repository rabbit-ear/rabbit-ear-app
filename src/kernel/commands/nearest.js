import { get } from "svelte/store";
import { Graph } from "../../stores/Model.js";
import {
	nearest,
	nearestVertex,
	nearestEdge,
	nearestFace,
} from "rabbit-ear/graph/nearest.js";

export const vertexAtPoint = (point) => nearestVertex(get(Graph), point);
export const edgeAtPoint = (point) => nearestEdge(get(Graph), point);
export const faceAtPoint = (point) => nearestFace(get(Graph), point);
