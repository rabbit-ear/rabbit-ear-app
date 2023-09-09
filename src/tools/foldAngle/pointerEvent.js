import { get } from "svelte/store";
import { snapToEdge } from "../../js/snap.js";
import { FoldAngleValue } from "./stores.js";
import execute from "../../kernel/execute.js";
import executeUI from "../../kernel/executeUI.js";

const pointerEventFoldAngle = (eventType, { point }) => {
	const { edge } = snapToEdge(point);
	if (edge === undefined) {
		executeUI("highlight", {});
		return;
	}
	executeUI("highlight", { edges: [edge] });
	switch (eventType) {
	case "press":
		if (edge === undefined) { break; }
		execute("setFoldAngle", [edge], get(FoldAngleValue));
		break;
	case "hover": break;
	case "move": break;
	case "release": break;
	}
};

export default pointerEventFoldAngle;
