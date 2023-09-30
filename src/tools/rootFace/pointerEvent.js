import {
	Move,
	Press,
	Release,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": Press.set(point); break;
	case "release": Release.set(point); break;
	}
	Move.set(point);
};

export default pointerEvent;
