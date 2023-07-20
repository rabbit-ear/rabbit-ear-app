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
	TOOL_KAWASAKI,
	TOOL_PLEAT,
	TOOL_SCRIBBLE,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
} from "../app/keys.js";
import { Tool } from "../stores/Tool.js";
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
import { pointerEventKawasaki } from "./pointerEventKawasaki.js";
import { pointerEventPleat } from "./pointerEventPleat.js";
import { pointerEventScribble } from "./pointerEventScribble.js";
import { pointerEventSplitEdge } from "./pointerEventSplitEdge.js";
import { pointerEventTranslate } from "./pointerEventTranslate.js";
import { pointerEventScale } from "./pointerEventScale.js";
import { pointerEventAssign } from "./pointerEventAssign.js";
import { pointerEventFoldAngle } from "./pointerEventFoldAngle.js";

const customPointerEvent = (eventType, event) => {
	switch (get(Tool)) {
	case TOOL_SELECT: return pointerEventSelect(eventType, event);
	case TOOL_CAMERA: return pointerEventCamera(eventType, event);
	case TOOL_VERTEX: return pointerEventVertex(eventType, event);
	case TOOL_EDGE: return pointerEventEdge(eventType, event);
	case TOOL_AXIOM_1: return pointerEventAxiom1(eventType, event);
	case TOOL_AXIOM_2: return pointerEventAxiom2(eventType, event);
	case TOOL_AXIOM_3: return pointerEventAxiom3(eventType, event);
	case TOOL_AXIOM_4: return pointerEventAxiom4(eventType, event);
	case TOOL_AXIOM_5: return pointerEventAxiom5(eventType, event);
	case TOOL_AXIOM_6: return pointerEventAxiom6(eventType, event);
	case TOOL_AXIOM_7: return pointerEventAxiom7(eventType, event);
	case TOOL_KAWASAKI: return pointerEventKawasaki(eventType, event);
	case TOOL_PLEAT: return pointerEventPleat(eventType, event);
	case TOOL_SCRIBBLE: return pointerEventScribble(eventType, event);
	case TOOL_SPLIT_EDGE: return pointerEventSplitEdge(eventType, event);
	case TOOL_TRANSLATE: return pointerEventTranslate(eventType, event);
	case TOOL_SCALE: return pointerEventScale(eventType, event);
	case TOOL_ASSIGN: return pointerEventAssign(eventType, event);
	case TOOL_FOLD_ANGLE: return pointerEventFoldAngle(eventType, event);
	default: break;
	}
};

export const pressEvent = ({ point }) => (
	customPointerEvent("press", { point })
);

export const moveEvent = ({ point, buttons }) => (buttons
	? customPointerEvent("move", { point, buttons })
	: customPointerEvent("hover", { point })
);

export const releaseEvent = ({ point }) => (
	customPointerEvent("release", { point })
);
