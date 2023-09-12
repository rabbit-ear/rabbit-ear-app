import { get } from "svelte/store";
import {
	FoldAngleValue,
	Move,
	Edge,
} from "./stores.js";
import execute from "../../kernel/execute.js";

const pointerEvent = (eventType, { point }) => {
	if (eventType === "press") {
		const edge = get(Edge);
		if (edge === undefined) { return; }
		return execute("setFoldAngle", [edge], get(FoldAngleValue));
	}
	Move.set(point);
};

export default pointerEvent;
