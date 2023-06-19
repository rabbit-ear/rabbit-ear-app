<script>
	import { createEventDispatcher } from "svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import {
		convertToViewBox,
		findInParents,
	} from "../../js/dom.js";
	import { viewBox } from "../../stores/app.js";

	const formatMouseEvent = (e) => ({
		buttons: e.buttons,
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const dispatch = createEventDispatcher();
	const mousedown = (e) => dispatch("press", formatMouseEvent(e));
	const mousemove = (e) => dispatch("move", formatMouseEvent(e));
	const mouseup = (e) => dispatch("release", formatMouseEvent(e));

	let vmax
	$: vmax = Math.max($viewBox[2], $viewBox[3]);

	const padViewBox = (view, pad) => [
		view[0] - pad,
		view[1] - pad,
		view[2] + pad * 2,
		view[3] + pad * 2,
	];
</script>

	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={padViewBox($viewBox, vmax * 0.1).join(" ")}
		stroke-width={$viewBox[2] * 0.0033}
		on:mousedown={mousedown}
		on:mousemove={mousemove}
		on:mouseup={mouseup}
	>
		<GridLayer />
		<GraphLayer />
		<UILayer />
	</svg>

<style>
	svg {
		flex: 1 0 calc(100vw - 8rem);
		width: 100%;
		height: 100%;
	}
</style>
