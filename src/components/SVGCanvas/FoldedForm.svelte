<script>
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import { VerticalUp } from "../../stores/App.js";
	import {
		FoldedForm,
		FlatFoldable,
	} from "../../stores/Model.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowIndices,
	} from "../../stores/App.js";
	import { Selection } from "../../stores/Select.js";
	import { Highlight } from "../../stores/UI.js";
	import {
		ArtificialScale,
		StrokeWidthFoldedForm,
	} from "../../stores/Style.js";
	import { ViewportFolded } from "../../stores/ViewBox.js";

	const padViewport = (view, pad) => {
		const p = Math.max(view[2], view[3]) * pad;
		return [view[0] - p, view[1] - p, view[2] + p * 2, view[3] + p * 2];
	};

	$: viewport = padViewport($ViewportFolded, 0.05);
	$: invertVertical = $VerticalUp;

	$: textY = invertVertical
		? -viewport[1] - viewport[3] / 2
		: viewport[1] + viewport[3] / 2;
	$: textTransform = `matrix(1, 0, 0, ${invertVertical ? -1 : 1}, ${viewport[0] + viewport[2] / 2}, ${textY})`;
</script>

<SVGTouchCanvas
	viewBox={viewport.join(" ")}
	strokeWidth={$StrokeWidthFoldedForm}
	scale={ArtificialScale}
	{invertVertical}
	on:press
	on:move
	on:release
	on:scroll>
	{#if $ShowGrid}
		<GridLayer {viewport} />
	{/if}
	{#if $FlatFoldable}
		<g class="origami-layer">
			<FacesLayer
				graph={$FoldedForm}
				selected={$Selection.faces}
				highlighted={$Highlight.faces} />
		</g>
		{#if $ShowIndices}
			<GraphIndices graph={$FoldedForm} {invertVertical} />
		{/if}
	{:else}
		<text
			transform={textTransform}
			font-size={Math.min(viewport[2], viewport[3]) * 0.1}>not foldable</text>
	{/if}
	{#if $ShowAxes}
		<AxesLayer {viewport} />
	{/if}
</SVGTouchCanvas>

<style>
	text {
		font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
		fill: var(--background-4);
		text-anchor: middle;
		dominant-baseline: middle;
		text-align: center;		
	}
</style>