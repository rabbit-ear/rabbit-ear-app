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
import { Current } from "../stores/UI.js";
import { execute } from "./app.js";

const setFoldAngle = (edge) => {

};

export const pointerEventFoldAngle = (eventType) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(Graph), get(Current)).edge;
		if (edge === undefined) { break; }
		setFoldAngle(edge);
		break;
	case "hover": {
		const edge = nearest(get(Graph), get(Current)).edge;
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
