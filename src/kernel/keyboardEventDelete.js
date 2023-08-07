import { get } from "svelte/store";
import { execute } from "./app.js";
import { Selection } from "../stores/Select.js";

// "delete" refers to keyCode 8, not the delete tool.
export const keyboardEventDelete = (eventType, event) => {
	switch (eventType) {
	case "down":
		event.preventDefault();
		execute("deleteComponents", get(Selection));
		// execute("deleteComponents", {
		// 	vertices: selected.vertices(),
		// 	edges: selected.edges(),
		// 	faces: selected.faces(),
		// });
		break;
	case "up":
		break;
	}
};
