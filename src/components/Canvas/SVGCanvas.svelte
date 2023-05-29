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

	const formatMouseEvent = (e) => ({
		// ...e,
		buttons: e.buttons,
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const mousedown = (e) => dispatch("press", formatMouseEvent(e));
	const mousemove = (e) => dispatch("move", formatMouseEvent(e));
	const mouseup = (e) => dispatch("release", formatMouseEvent(e));
</script>

<div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={$viewBox.join(" ")}
		on:mousedown={mousedown}
		on:mousemove={mousemove}
		on:mouseup={mouseup}
	>
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
