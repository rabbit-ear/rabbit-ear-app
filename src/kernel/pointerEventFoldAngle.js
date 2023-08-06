import { get } from "svelte/store";
import { snapToEdge } from "../js/snap.js";
import { Selection } from "../stores/Select.js";
import { FoldAngleValue } from "../stores/Tool.js";
import { execute } from "./app.js";

export const pointerEventFoldAngle = (eventType, { point }) => {
	const { edge } = snapToEdge(point);
	switch (eventType) {
	case "press":
		if (edge === undefined) { break; }
		execute("setFoldAngle", [edge], get(FoldAngleValue));
		break;
	case "hover":
		if (edge === undefined) { break; }
		Selection.reset();
		Selection.addEdges([edge]);
		break;
	case "move": break;
	case "release": break;
	}
};
