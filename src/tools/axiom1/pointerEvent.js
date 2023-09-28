import {
	Move,
	Drag,
	Presses,
	Releases,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": Presses.update(p => [...p, point]); break;
	case "release": Releases.update(p => [...p, point]); break;
	}
	Move.set(buttons ? undefined : point);
	Drag.set(buttons ? point : undefined);
};

export default pointerEvent;
