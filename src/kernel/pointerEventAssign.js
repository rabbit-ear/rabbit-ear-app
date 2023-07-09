import { nearest } from "rabbit-ear/graph/nearest.js";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { selection } from "../stores/select.js";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import {
	graph,
} from "../stores/graph.js";
import { assignType } from "../stores/tool.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { execute } from "./app.js";

const swap = { M: "V", m: "V", V: "M", v: "M" };

const performAssignment = (edge) => {
	const g = get(graph);
	switch (get(assignType)) {
	case ASSIGN_SWAP:
		if (g.edges_assignment[edge] === "B"
			|| g.edges_assignment[edge] === "b") {
			break;
		}
		g.edges_assignment[edge] = swap[g.edges_assignment[edge]] || "M";
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
	graph.simpleSet({ ...g });
}

export const pointerEventAssign = (eventType) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		performAssignment(edge);
		break;
	case "hover": {
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		selection.reset();
		selection.addEdges([edge]);
	}
		break;
	case "move":
		break;
	case "release":
		break;
	}
};
