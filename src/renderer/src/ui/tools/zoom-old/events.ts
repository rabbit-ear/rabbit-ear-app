import state from "./state.svelte.ts";
import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";
import {
	wheelEventZoomMatrix,
	wheelPanMatrix,
} from "./matrix.ts";

export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	// if (!state.tool.viewport) { state.tool.viewport = viewport; }
	else if (state.tool.viewport !== undefined && viewport !== state.tool.viewport) { return; }
	console.log("onmousemove");
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	if (!state.tool.viewport) { state.tool.viewport = viewport; }
	else if (viewport !== state.tool.viewport) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.press = point;
};

export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { return; }
	if (!state.tool.viewport) { state.tool.viewport = viewport; }
	else if (viewport !== state.tool.viewport) { return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	// state.tool.release = point;
	state.tool.reset();
};

export const onmouseleave = (event: ViewportMouseEvent) => {
	state.reset();
};

export const onwheel = ({ point, deltaX, deltaY }: ViewportWheelEvent) => {
	// if (!viewport) { return; }
	switch (id) {
		case "right-canvas": return wheelPanMatrix(viewport, { deltaX, deltaY });
		case "left-canvas": return wheelEventZoomMatrix(viewport, { point, deltaY });
		default: return wheelEventZoomMatrix(viewport, { point, deltaY });
	}
};
