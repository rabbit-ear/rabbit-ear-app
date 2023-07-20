import { nearest } from "rabbit-ear/graph/nearest.js";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { Selection } from "../stores/Select.js";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import { Graph } from "../stores/Graph.js";
import { AssignType } from "../stores/Tool.js";
import { Current } from "../stores/UI.js";
import { execute } from "./app.js";

const swap = { M: "V", m: "V", V: "M", v: "M" };

const performAssignment = (edge) => {
	const g = get(Graph);
	switch (get(AssignType)) {
	case ASSIGN_SWAP:
		// if (g.edges_assignment[edge] === "B"
		// 	|| g.edges_assignment[edge] === "b") {
		// 	break;
		// }
		g.edges_assignment[edge] = swap[g.edges_assignment[edge]] || "V";
		if (g.edges_foldAngle[edge] == null || g.edges_foldAngle[edge] === 0) {
			g.edges_foldAngle[edge] = g.edges_assignment[edge] === "M"
				? -180
				: 180;
		} else {
			g.edges_foldAngle[edge] = g.edges_assignment[edge] === "M"
				? -Math.abs(g.edges_foldAngle[edge])
				: Math.abs(g.edges_foldAngle[edge]);
		}
		break;
	case ASSIGN_FLAT:
		g.edges_assignment[edge] = "F";
		g.edges_foldAngle[edge] = 0;
		break;
	case ASSIGN_UNASSIGNED:
		g.edges_assignment[edge] = "U";
		g.edges_foldAngle[edge] = 0;
		break;
	case ASSIGN_CUT:
		g.edges_assignment[edge] = "C";
		g.edges_foldAngle[edge] = 0;
		break;
	case ASSIGN_BOUNDARY:
		g.edges_assignment[edge] = "B";
		g.edges_foldAngle[edge] = 0;
		break;
	default: break;
	}
	Graph.simpleSet({ ...g });
}

export const pointerEventAssign = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(Graph), point).edge;
		if (edge === undefined) { break; }
		performAssignment(edge);
		break;
	case "hover": {
		const edge = nearest(get(Graph), point).edge;
		if (edge === undefined) { break; }
		Selection.reset();
		Selection.addEdges([edge]);
	}
		break;
	case "move":
		break;
	case "release":
		break;
	}
};
