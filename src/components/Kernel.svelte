<script>
	import { handleToolSelect } from "../kernel/handleToolSelect.js";
	import { handleToolVertex } from "../kernel/handleToolVertex.js";
	import {
		TOOL_SELECT,
		TOOL_VERTEX,
	} from "../js/enums.js";
	import { tool } from "../stores/app.js";
	import {
		keyboard,
		presses,
		releases,
		moves,
		current,
	} from "../stores/ui.js";

	const handleTool = (eventType) => {
		switch ($tool) {
		case TOOL_SELECT: return handleToolSelect(eventType);
		case TOOL_VERTEX: return handleToolVertex(eventType);
		default: break;
		}
	};

	export const press = (e) => {
		const { point } = e.detail;
		$presses.push(point);
		return handleTool("press");
	};

	export const move = (e) => {
		const { point, buttons } = e.detail;
		$current = point;
		if (!buttons) { return; }
		$moves.push(point);
		return handleTool("move");
	};

	export const release = (e) => {
		const { point } = e.detail;
		$releases.push(point);
		return handleTool("release");
	};

</script>