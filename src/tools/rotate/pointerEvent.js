import {
	Move,
	Press,
	Drag,
	Release,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	// switch (eventType) {
	// case "press": Press.set(point); break;
	// case "release": Release.set(point); break;
	// }
	// if (buttons) { Drag.set(point); }
	// else { Move.set(point); }
};

export default pointerEvent;
