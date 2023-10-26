import {
	CPDrag,
	CPPress,
	FoldedDrag,
	FoldedPress,
} from "./stores.js";

export const cpPointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": CPPress.set(point); break;
	case "release": CPPress.set(undefined); break;
	default: break;
	}
	if (buttons) { CPDrag.set(point); }
	else { CPDrag.set(undefined); }
};

export const foldedPointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": FoldedPress.set(point); break;
	case "release": FoldedPress.set(undefined); break;
	default: break;
	}
	if (buttons) { FoldedDrag.set(point); }
	else { FoldedDrag.set(undefined); }
};
