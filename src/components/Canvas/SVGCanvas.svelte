<script>
	import { createEventDispatcher } from "svelte";
	import GridLayer from "./GridLayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import {
		convertToViewBox,
		findInParents,
	} from "../../js/dom.js";
	import { viewBox } from "../../stores/app.js";

	const dispatch = createEventDispatcher();

	const formatEvent = (e) => ({
		...e,
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const onMouseDown = (e) => dispatch("press", formatEvent(e));
	const onMouseMove = (e) => dispatch("move", formatEvent(e));
	const onMouseUp = (e) => dispatch("release", formatEvent(e));
</script>

<div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={$viewBox.join(" ")}
		on:mousedown={onMouseDown}
		on:mousemove={onMouseMove}
		on:mouseup={onMouseUp}>
		<GridLayer />
		<GraphLayer />
	</svg>
</div>

<style>
	div {
		flex: 1 0 auto;
		padding: 1rem;
	}
	svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}
</style>
