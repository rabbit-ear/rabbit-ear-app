import state from "./state.svelte.ts";
import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";

export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	if (buttons) {
		state.tool.drags.push(point);
	}
};

export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drags = [];
	state.tool.presses.push(point);
};

export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	// state.drags = (buttons ? point : undefined);
	state.tool.releases.push(point);
	state.tool.addToModel();
};

// export const onmouseleave = (event: ViewportMouseEvent) => {
// 	reset();
// };
