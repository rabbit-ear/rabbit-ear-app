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
	RulerSetRequest,
} from "./stores.js";

export const cpPointerEvent = (eventType, { point, buttons }) => {
	CPMove.set(buttons ? undefined : point);
	CPDrag.set(buttons ? point : undefined);
	switch (eventType) {
	case "press":
		RulerSetRequest.set(true);
		CPPresses.update(p => [...p, point]);
		break;
	case "release":
		RulerSetRequest.set(true);
		CPReleases.update(p => [...p, point]);
		break;
	case "exit": reset(); break;
	}
};

export const foldedPointerEvent = (eventType, { point, buttons }) => {
	FoldedMove.set(buttons ? undefined : point);
	FoldedDrag.set(buttons ? point : undefined);
	switch (eventType) {
	case "press":
		RulerSetRequest.set(true);
		FoldedPresses.update(p => [...p, point]);
		break;
	case "release":
		RulerSetRequest.set(true);
		FoldedReleases.update(p => [...p, point]);
		break;
	case "exit": reset(); break;
	}
};
