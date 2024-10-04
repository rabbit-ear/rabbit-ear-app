import state from "./state.svelte.ts";
import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";

export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.presses.push(point);
};

export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.releases.push(point);
};

// import state from "./state.svelte.ts";
// import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";

// export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// };

// export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// 	state?.touches.presses.push(point);
// };

// export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// 	state?.touches.releases.push(point);
// };
