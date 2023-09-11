import { get } from "svelte/store";
import {
	// CurrentSnap,
	Keyboard,
	UIGraph,
} from "../../stores/UI.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Snap.js";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import execute from "../../kernel/execute.js";
import executeUI from "../../kernel/executeUI.js";
import { Data } from "./stores.js";

const pointerEvent = (eventType, { point }) => {
	const shift = get(Keyboard)[16];
	const coords = shift
		? snapToRulerLine(point).coords
		: snapToPoint(point, false);
	// CurrentSnap.set(coords);
	switch (eventType) {
	case "press":
		Data.pressCoords = coords;
		if (shift) { // Shift
			execute("radialRulers",
				Data.pressCoords,
				get(RadialSnapDegrees),
				get(RadialSnapOffset),
			);
		}
		UIGraph.set({ vertices_coords: [coords] });
	break;
	case "move":
		if (Data.pressCoords) {
			UIGraph.set({
				vertices_coords: [Data.pressCoords, coords],
				edges_vertices: [[0, 1]],
			});
		} else {
			UIGraph.set({ vertices_coords: [coords] });
		}
	break;
	case "release":
		// execute("addEdge",
		// 	execute("addVertex", Data.pressCoords),
		// 	execute("addVertex", coords),
		// );
		execute("addEdge", Data.pressCoords, coords);
		executeUI("resetUI");
		Data.pressCoords = undefined;
		UIGraph.set({ vertices_coords: [coords] });
	break;
	}
};

export default pointerEvent;
