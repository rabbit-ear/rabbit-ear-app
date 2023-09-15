import { get } from "svelte/store";
import { executeCommand } from "../../kernel/execute.js";
import {
	Move,
	Press,
	Drag,
	PressCoords,
	DragCoords,
	reset,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press":
		Press.set(point);
		break;
	case "release":
		const start = get(PressCoords);
		const end = get(DragCoords);
		if (start !== undefined && end !== undefined) {
			executeCommand("foldedLine", start, end);
		}
		reset();
		break;
	}
	if (buttons) { Drag.set(point); }
	else { Move.set(point); }
};

export default pointerEvent;

// import { get } from "svelte/store";
// import {
// 	// CurrentSnap,
// 	Keyboard,
// 	UIGraph,
// } from "../../stores/UI.js";
// import {
// 	RulerLines,
// 	RulerRays,
// } from "../../stores/Ruler.js";
// import {
// 	RadialSnapDegrees,
// 	RadialSnapOffset,
// } from "../../stores/Snap.js";
// import {
// 	snapToPoint,
// 	snapToRulerLine,
// } from "../../js/snap.js";
// import { executeCommand } from "../../kernel/execute.js";
// import { Presses } from "./stores.js";

// let pressCoords = undefined;

// const pointerEventFoldLine = (eventType, { point }) => {
// 	const shift = get(Keyboard)[16];
// 	const coords = shift
// 		? snapToRulerLine(point).coords
// 		: snapToPoint(point, false);
// 	// CurrentSnap.set(coords);
// 	switch (eventType) {
// 	case "hover":
// 		UIGraph.set({ vertices_coords: [coords] });
// 	break;
// 	case "press":
// 		pressCoords = coords;
// 		Presses.set([pressCoords]);
// 		if (shift) { // Shift
// 			executeCommand("radialRulers",
// 				pressCoords,
// 				get(RadialSnapDegrees),
// 				get(RadialSnapOffset),
// 			);
// 		}
// 		UIGraph.set({ vertices_coords: [coords] });
// 	break;
// 	case "move": {
// 		executeCommand("repeatFoldLinePreview", pressCoords, coords);
// 	}
// 	break;
// 	case "release":
// 		executeCommand("repeatFoldLine", pressCoords, coords);
// 		Presses.set([]);
// 		RulerLines.set([]);
// 		RulerRays.set([]);
// 		UIGraph.set({ vertices_coords: [coords] });
// 	break;
// 	}
// };

// export default pointerEventFoldLine;
