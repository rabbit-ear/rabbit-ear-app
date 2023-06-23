<script>
	import { pointerEventSelect } from "../kernel/pointerEventSelect.js";
	import { pointerEventVertex } from "../kernel/pointerEventVertex.js";
	import { pointerEventEdge } from "../kernel/pointerEventEdge.js";
	import { pointerEventSplitEdge } from "../kernel/pointerEventSplitEdge.js";
	import { pointerEventTranslate } from "../kernel/pointerEventTranslate.js";
	import { pointerEventScale } from "../kernel/pointerEventScale.js";
	import {
		keyboardEventDown,
		keyboardEventUp,
	} from "../kernel/keyboardEvent.js";
	import { scrollEvent } from "../kernel/scrollEvent.js";
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
		TOOL_EDGE,
		TOOL_SPLIT_EDGE,
		TOOL_TRANSLATE,
		TOOL_SCALE,
	} from "../app/keys.js";
	import { tool } from "../stores/app.js";
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
		case TOOL_VERTEX: return pointerEventVertex(eventType);
		case TOOL_EDGE: return pointerEventEdge(eventType);
		case TOOL_SPLIT_EDGE: return pointerEventSplitEdge(eventType);
		case TOOL_TRANSLATE: return pointerEventTranslate(eventType);
		case TOOL_SCALE: return pointerEventScale(eventType);
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
