import {
	CPMove,
	CPPress,
	CPRelease,
	CPDrag,
	FoldedMove,
	FoldedPress,
	FoldedRelease,
	FoldedDrag,
	reset,
} from "./stores.js";

export const cpPointerEvent = (eventType, { point, buttons }) => {
	CPMove.set(buttons ? undefined : point);
	CPDrag.set(buttons ? point : undefined);
	switch (eventType) {
		case "press":
			CPPress.set(point);
			break;
		case "release":
			CPRelease.set(point);
			break;
		case "exit":
			reset();
			break;
	}
};

export const foldedPointerEvent = (eventType, { point, buttons }) => {
	FoldedMove.set(buttons ? undefined : point);
	FoldedDrag.set(buttons ? point : undefined);
	switch (eventType) {
		case "press":
			FoldedPress.set(point);
			break;
		case "release":
			FoldedRelease.set(point);
			break;
		case "exit":
			reset();
			break;
	}
};
