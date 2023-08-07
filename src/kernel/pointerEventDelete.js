import { Highlight } from "../stores/Select.js";
import { execute } from "./app.js";
import { snapToEdge } from "../js/snap.js";

let pressEdge;

export const pointerEventDelete = (eventType, { point }) => {
	Highlight.reset();
	const { edge, coords } = snapToEdge(point);
	if (edge === undefined) { return; }
	Highlight.addEdges([edge]);
	switch (eventType) {
	case "hover":
		break;
	case "press":
		pressEdge = edge;
		break;
	case "move":
		break;
	case "release":
		if (pressEdge !== undefined && pressEdge === edge) {
			execute("deleteComponents", { edges: [pressEdge] });
			Highlight.reset();
		}
		break;
	}
};
