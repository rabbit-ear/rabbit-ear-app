<script>
	import { pointerEventSelect } from "../kernel/pointerEventSelect.js";
	import { pointerEventCamera } from "../kernel/pointerEventCamera.js";
	import { pointerEventVertex } from "../kernel/pointerEventVertex.js";
	import { pointerEventEdge } from "../kernel/pointerEventEdge.js";
	import { pointerEventAxiom2 } from "../kernel/pointerEventAxiom2.js";
	import { pointerEventAxiom7 } from "../kernel/pointerEventAxiom7.js";
	import { pointerEventSplitEdge } from "../kernel/pointerEventSplitEdge.js";
	import { pointerEventTranslate } from "../kernel/pointerEventTranslate.js";
	import { pointerEventScale } from "../kernel/pointerEventScale.js";
	import { pointerEventAssign } from "../kernel/pointerEventAssign.js";
	import { pointerEventFoldAngle } from "../kernel/pointerEventFoldAngle.js";
	import {
		keyboardEventDown,
		keyboardEventUp,
	} from "../kernel/keyboardEvent.js";
	import { scrollEvent } from "../kernel/scrollEvent.js";
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
	import { tool } from "../stores/tool.js";
	import {
		keyboard,
		presses,
		releases,
		moves,
		current,
	} from "../stores/ui.js";

	const pointerEvent = (eventType) => {
		switch ($tool) {
		case TOOL_SELECT: return pointerEventSelect(eventType);
		case TOOL_CAMERA: return pointerEventCamera(eventType);
		case TOOL_VERTEX: return pointerEventVertex(eventType);
		case TOOL_EDGE: return pointerEventEdge(eventType);
		// case TOOL_AXIOM_1: return pointerEventAxiom1(eventType);
		case TOOL_AXIOM_2: return pointerEventAxiom2(eventType);
		// case TOOL_AXIOM_3: return pointerEventAxiom3(eventType);
		// case TOOL_AXIOM_4: return pointerEventAxiom4(eventType);
		// case TOOL_AXIOM_5: return pointerEventAxiom5(eventType);
		// case TOOL_AXIOM_6: return pointerEventAxiom6(eventType);
		case TOOL_AXIOM_7: return pointerEventAxiom7(eventType);
		case TOOL_SPLIT_EDGE: return pointerEventSplitEdge(eventType);
		case TOOL_TRANSLATE: return pointerEventTranslate(eventType);
		case TOOL_SCALE: return pointerEventScale(eventType);
		case TOOL_ASSIGN: return pointerEventAssign(eventType);
		case TOOL_FOLD_ANGLE: return pointerEventFoldAngle(eventType);
		default: break;
		}
	};

	export const press = (e) => {
		const { point } = e.detail;
		$presses.push(point);
		return pointerEvent("press");
	};

	export const move = (e) => {
		const { point, buttons } = e.detail;
		$current = point;
		if (!buttons) {
			return pointerEvent("hover");
		}
		$moves.push(point);
		return pointerEvent("move");
	};

	export const release = (e) => {
		const { point } = e.detail;
		$releases.push(point);
		return pointerEvent("release");
	};

	export const scroll = (e) => scrollEvent(e.detail);

	export const keydown = (e) => keyboardEventDown(e);

	export const keyup = (e) => keyboardEventUp(e);

	export const executeCommand = (fn, ...params) => {};
</script>
