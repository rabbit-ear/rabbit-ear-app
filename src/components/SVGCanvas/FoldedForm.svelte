<script>
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import FacesFoldedLayer from "./FacesFoldedLayer.svelte";
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
	import { StrokeWidthFoldedForm } from "../../stores/Style.js";
	import { ViewportFolded } from "../../stores/ViewBox.js";

	const padViewport = (view, pad) => {
		const p = Math.max(view[2], view[3]) * pad;
		return [view[0] - p, view[1] - p, view[2] + p * 2, view[3] + p * 2];
	};

	$: viewport = padViewport($ViewportFolded, 0.05);
	$: invertVertical = $VerticalUp;
</script>

<SVGTouchCanvas
	viewBox={viewport.join(" ")}
	strokeWidth={$StrokeWidthFoldedForm}
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
			<FacesFoldedLayer
				graph={$FoldedForm}
				selected={$Selection.faces}
				highlighted={$Highlight.faces} />
		</g>
		{#if $ShowIndices}
			<GraphIndices graph={$FoldedForm} {invertVertical} />
		{/if}
	<!-- {:else} -->
	{/if}
	{#if $ShowAxes}
		<AxesLayer {viewport} />
	{/if}
</SVGTouchCanvas>
