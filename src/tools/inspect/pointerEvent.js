import { get } from "svelte/store";
import {
	Press,
	UpdateTarget,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press":
		Press.update(prev => {
			if (prev) { UpdateTarget(point); }
			return prev ? undefined : point;
		});
		break;
	case "move":
		if (get(Press) === undefined) {
			UpdateTarget(point);
		}
		break;
	case "release": break;
	default: break;
	}
};

export default pointerEvent;
