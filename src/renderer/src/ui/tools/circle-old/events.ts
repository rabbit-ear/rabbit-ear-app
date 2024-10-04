import state from "./state.svelte.ts";
import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";

export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.presses.push(point);
};

export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.releases.push(point);
};

export const onmouseleave = (event: ViewportMouseEvent) => {
	state.reset();
};
