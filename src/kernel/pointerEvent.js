import { get } from "svelte/store";
import {
	Current,
	CurrentSnap,
} from "../stores/UI.js";
import { ToolNew } from "../stores/Tool.js";

const customPointerEvent = (eventType, event) => {
	Current.set(event.point);
	CurrentSnap.set(undefined);
	const tool = get(ToolNew);
	const { pointerEvent } = tool;
	if (pointerEvent) { return pointerEvent(eventType, event); }
};

export const pressEvent = ({ point }) => (
	customPointerEvent("press", { point })
);

export const moveEvent = ({ point, buttons }) => (buttons
	? customPointerEvent("move", { point, buttons })
	: customPointerEvent("hover", { point })
);

export const releaseEvent = ({ point }) => (
	customPointerEvent("release", { point })
);
