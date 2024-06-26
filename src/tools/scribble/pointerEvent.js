import { get } from "svelte/store";
import { Press, Drags, Release, PolylineSmooth } from "./stores.js";
import { executeCommand } from "../../kernel/execute.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
		case "press":
			Press.set(point);
			Drags.set([]);
			Release.set(undefined);
			break;
		case "move":
			if (buttons) {
				Drags.update((p) => [...p, point]);
			}
			break;
		case "release":
			Release.set(point);
			executeCommand("polyline", get(PolylineSmooth));
			break;
	}
};

export default pointerEvent;
