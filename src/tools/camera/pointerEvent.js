import execute from "../../kernel/execute.js";
import {
	Drag,
	Press,
} from "./stores.js";

const pointerEvent = (eventType, { point, buttons }) => {
	switch (eventType) {
	case "press": Press.set(point); break;
	case "release": Press.set(undefined); break;
	default: break;
	}
	if (buttons) { Drag.set(point); }
	else { Drag.set(undefined); }
};

export default pointerEvent;
