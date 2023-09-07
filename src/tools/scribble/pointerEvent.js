import { get } from "svelte/store";
import { nearest } from "rabbit-ear/graph/nearest.js";
import { Selection } from "../../stores/Select.js";
import {
	Presses,
	Moves,
	Releases,
} from "../../stores/UI.js";
import { getSnapPoint } from "../../js/nearest.js";
import { Graph } from "../../stores/Model.js";
// import { ToolStep } from "./stores.js";
import execute from "../../kernel/execute.js";

let pressEdge = undefined;
let pressVertex = undefined;

const pointerEventScribble = (eventType, { point }) => {
	// const { vertex, edge } = nearest(get(Graph), point);
	switch (eventType) {
	case "press":
		Presses.set([point]);
		Moves.set([]);
		Releases.set([]);
		break;
	case "hover": break;
	case "move":
		Moves.update(p => [...p, point]);
		break;
	case "release":
		Releases.set([point]);
		break;
	}
};

export default pointerEventScribble;
