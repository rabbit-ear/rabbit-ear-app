import { get } from "svelte/store";
import { snapToPoint, snapToVertex } from "../../js/snap.js";
import { Highlight } from "../../stores/Select.js";
import {
	Presses,
	Releases,
	ToolStep,
} from "./stores.js";
import { RulerRays } from "../../stores/Ruler.js";
import execute from "../../kernel/execute.js";
import {
	UIGraph,
	UIRays,
} from "../../stores/UI.js";

let pressVertex;
let pressCoords;

const pointerEventKawasaki = (eventType, { point }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "hover": break;
	case "move": break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	switch (get(ToolStep)) {
	case 0: {
		Highlight.reset();
		const { vertex, coords } = snapToVertex(point, true);
		if (vertex !== undefined) {
			Highlight.addVertices([vertex]);
			execute("kawasakiRulerPreviews", vertex);
		}
	}
		break;
	case 1:
		if (eventType === "press") {
			const { vertex, coords } = snapToVertex(point, true);
			pressVertex = vertex;
			pressCoords = coords;
			UIRays.set([]);
			execute("kawasakiRulers", vertex);
		} else {
			const coords = snapToPoint(point, false);
			UIGraph.set({
				vertices_coords: [pressCoords, coords],
				edges_vertices: [[0, 1]],
			});
		}
		break;
	default:
		// release
		execute("addEdge", pressCoords, snapToPoint(point, false));
		UIGraph.set({});
		RulerRays.set([]);
		Presses.set([]);
		Releases.set([]);
		break;
	}
};

export default pointerEventKawasaki;
