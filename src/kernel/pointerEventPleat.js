import { nearest } from "rabbit-ear/graph/nearest.js";
import { get } from "svelte/store";
import { Selection } from "../stores/Select.js";
import { Graph } from "../stores/Graph.js";
import { execute } from "./app.js";

export const pointerEventPleat = (eventType, { point }) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(Graph), point).edge;
		if (edge === undefined) { break; }
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
