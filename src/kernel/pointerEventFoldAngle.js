import { nearest } from "rabbit-ear/graph/nearest.js";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { selected } from "../stores/select.js";
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
import { assignType } from "../stores/app.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { execute } from "./app.js";

const setFoldAngle = (edge) => {

};

export const pointerEventFoldAngle = (eventType) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		setFoldAngle(edge);
		break;
	case "hover": {
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		const edges = [];
		edges[edge] = true;
		selected.set({ ...get(selected), edges });
	}
		break;
	case "move":
		break;
	case "release":
		break;
	}
};
