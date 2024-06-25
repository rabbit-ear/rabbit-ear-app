import {
	CPMove,
	CPPresses,
	CPReleases,
	CPDrag,
	FoldedMove,
	FoldedPresses,
	FoldedReleases,
	FoldedDrag,
	reset,
} from "./stores.js";

export const cpPointerEvent = (eventType, { point, buttons }) => {
	CPMove.set(buttons ? undefined : point);
	CPDrag.set(buttons ? point : undefined);
	switch (eventType) {
		case "press":
			CPPresses.update((p) => [...p, point]);
			break;
		case "release":
			CPReleases.update((p) => [...p, point]);
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
			FoldedPresses.update((p) => [...p, point]);
			break;
		case "release":
			FoldedReleases.update((p) => [...p, point]);
			break;
		case "exit":
			reset();
			break;
	}
};
