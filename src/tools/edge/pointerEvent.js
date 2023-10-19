import {
	CPMove,
	CPPress,
	CPRelease,
	CPDrag,
	FoldedMove,
	FoldedPress,
	FoldedRelease,
	FoldedDrag,
} from "./stores.js";

export const cpPointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": CPPress.set(point); break;
	case "release": CPRelease.set(point); break;
	}
	CPMove.set(buttons ? undefined : point);
	CPDrag.set(buttons ? point : undefined);
};

export const foldedPointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": FoldedPress.set(point); break;
	case "release": FoldedRelease.set(point); break;
	}
	FoldedMove.set(buttons ? undefined : point);
	FoldedDrag.set(buttons ? point : undefined);
};
