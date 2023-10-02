import { get } from "svelte/store";
import { CreasePattern } from "../../stores/Model.js";
import {
	nearest,
	nearestVertex,
	nearestEdge,
	nearestFace,
} from "rabbit-ear/graph/nearest.js";

export const vertexAtPoint = (point) => nearestVertex(get(CreasePattern), point);
export const edgeAtPoint = (point) => nearestEdge(get(CreasePattern), point);
export const faceAtPoint = (point) => nearestFace(get(CreasePattern), point);
