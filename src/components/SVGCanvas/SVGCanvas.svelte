<script>
	import { createEventDispatcher } from "svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import ToolLayer from "./ToolLayer.svelte";
	import FlatFoldable from "./FlatFoldable.svelte";
	import { Graph } from "../../stores/Model.js";
	import {
		convertToViewBox,
		findInParents,
	} from "../../js/dom.js";
	import { ViewBox } from "../../stores/ViewBox.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowFlatFoldableIssues,
		ShowIndices,
	} from "../../stores/App.js";

	const formatMouseEvent = (e) => ({
		buttons: e.buttons,
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const formatWheelEvent = (e) => ({
		wheelDelta: e.wheelDelta, // wheelDeltaX, wheelDeltaY
		point: convertToViewBox(findInParents(e.target, "svg"), e.x, e.y),
	});

	const dispatch = createEventDispatcher();
	const mousedown = (e) => dispatch("press", formatMouseEvent(e));
	const mousemove = (e) => dispatch("move", formatMouseEvent(e));
	const mouseup = (e) => dispatch("release", formatMouseEvent(e));
	const wheel = (e) => dispatch("scroll", formatWheelEvent(e));

	let vmax
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	const padViewBox = (view, pad) => [
		view[0] - pad,
		view[1] - pad,
		view[2] + pad * 2,
		view[3] + pad * 2,
	];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={padViewBox($ViewBox, vmax * 0.05).join(" ")}
	stroke-width={$ViewBox[2] * 0.0033}
	on:mousedown={mousedown}
	on:mousemove={mousemove}
	on:mouseup={mouseup}
	on:wheel={wheel}
	on:focus={() => {}}
	on:blur={() => {}}
	role="presentation"
>
	{#if $ShowGrid}
		<GridLayer />
	{/if}
	<GraphLayer />
	{#if $ShowAxes}
		<AxesLayer />
	{/if}
	{#if $ShowFlatFoldableIssues}
		<FlatFoldable graph={$Graph} />
	{/if}
	<RulerLayer />
	<UILayer />
	<ToolLayer />
	{#if $ShowIndices}
		<GraphIndices />
	{/if}
</svg>

	<!-- i'm not sure what role=presentation means, i just guessed -->

<style>
	svg {
		width: 100%;
		height: 100%;
		transform: matrix(1, 0, 0, -1, 0, 1);
	}
</style>
