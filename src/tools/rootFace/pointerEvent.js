import { Press } from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	if (eventType === "press") {
		Press.set(point);
	}
};

export default pointerEvent;
