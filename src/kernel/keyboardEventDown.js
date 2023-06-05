import { get } from "svelte/store";
import { graph } from "../stores/graph.js";
import { selected } from "../stores/select.js";
import { deleteComponents } from "../js/graph.js";

export const keyboardEventDown = (e) => {
	console.log(e.key, e.keyCode);
	switch (e.keyCode) {
	case 8: // backspace
		e.preventDefault();
		graph.set({ ...deleteComponents(get(graph), get(selected)) });
		break;
	default: break;
	}
};
