<script>
	import { pointerEventSelect } from "../kernel/pointerEventSelect.js";
	import { pointerEventVertex } from "../kernel/pointerEventVertex.js";
	import { keyboardEventDown } from "../kernel/keyboardEventDown.js";
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
	} from "../js/enums.js";
	import {
		tool,
		selectElement,
	} from "../stores/app.js";
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
		if (!buttons) { return; }
		$moves.push(point);
		return pointerEvent("move");
	};

	export const release = (e) => {
		const { point } = e.detail;
		$releases.push(point);
		return pointerEvent("release");
	};

	export const keydown = (e) => keyboardEventDown(e);

</script>