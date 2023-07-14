import { get } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_CAMERA,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_AXIOM_1,
	TOOL_AXIOM_2,
	TOOL_AXIOM_3,
	TOOL_AXIOM_4,
	TOOL_AXIOM_5,
	TOOL_AXIOM_6,
	TOOL_AXIOM_7,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
} from "../app/keys.js";
import { Tool } from "../stores/Tool.js";
import {
	Presses,
	Releases,
	Moves,
	Current,
} from "../stores/UI.js";
import { pointerEventSelect } from "./pointerEventSelect.js";
import { pointerEventCamera } from "./pointerEventCamera.js";
import { pointerEventVertex } from "./pointerEventVertex.js";
import { pointerEventEdge } from "./pointerEventEdge.js";
import { pointerEventAxiom1 } from "./pointerEventAxiom1.js";
import { pointerEventAxiom2 } from "./pointerEventAxiom2.js";
import { pointerEventAxiom3 } from "./pointerEventAxiom3.js";
import { pointerEventAxiom4 } from "./pointerEventAxiom4.js";
import { pointerEventAxiom5 } from "./pointerEventAxiom5.js";
import { pointerEventAxiom6 } from "./pointerEventAxiom6.js";
import { pointerEventAxiom7 } from "./pointerEventAxiom7.js";
import { pointerEventSplitEdge } from "./pointerEventSplitEdge.js";
import { pointerEventTranslate } from "./pointerEventTranslate.js";
import { pointerEventScale } from "./pointerEventScale.js";
import { pointerEventAssign } from "./pointerEventAssign.js";
import { pointerEventFoldAngle } from "./pointerEventFoldAngle.js";

const customPointerEvent = (eventType) => {
	switch (get(Tool)) {
	case TOOL_SELECT: return pointerEventSelect(eventType);
	case TOOL_CAMERA: return pointerEventCamera(eventType);
	case TOOL_VERTEX: return pointerEventVertex(eventType);
	case TOOL_EDGE: return pointerEventEdge(eventType);
	case TOOL_AXIOM_1: return pointerEventAxiom1(eventType);
	case TOOL_AXIOM_2: return pointerEventAxiom2(eventType);
	case TOOL_AXIOM_3: return pointerEventAxiom3(eventType);
	case TOOL_AXIOM_4: return pointerEventAxiom4(eventType);
	case TOOL_AXIOM_5: return pointerEventAxiom5(eventType);
	case TOOL_AXIOM_6: return pointerEventAxiom6(eventType);
	case TOOL_AXIOM_7: return pointerEventAxiom7(eventType);
	case TOOL_SPLIT_EDGE: return pointerEventSplitEdge(eventType);
	case TOOL_TRANSLATE: return pointerEventTranslate(eventType);
	case TOOL_SCALE: return pointerEventScale(eventType);
	case TOOL_ASSIGN: return pointerEventAssign(eventType);
	case TOOL_FOLD_ANGLE: return pointerEventFoldAngle(eventType);
	default: break;
	}
};

export const pressEvent = ({ point }) => {
	// const t = get(Tool);
	Presses.update(p => [...p, point]);
	return customPointerEvent("press");
};

export const moveEvent = ({ point, buttons }) => {
	Current.set(point);
	if (!buttons) {
		return customPointerEvent("hover");
	}
	Moves.update(p => [...p, point]);
	return customPointerEvent("move");
};

export const releaseEvent = ({ point }) => {
	Releases.update(p => [...p, point]);
	return customPointerEvent("release");
};
