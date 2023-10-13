<script>
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import FoldableVertices from "./FoldableVertices.svelte";
	import { CreasePattern } from "../../stores/Model.js";
	import { VerticalUp } from "../../stores/App.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowFlatFoldableIssues,
		ShowIndices,
	} from "../../stores/App.js";
	import { Selection } from "../../stores/Select.js";
	import {
		Tool,
		Highlight,
	} from "../../stores/UI.js";
	import {
		ArtificialScale,
		StrokeWidthCreasePattern,
		StrokeDashLengthCreasePattern,
	} from "../../stores/Style.js";
	import { ViewportCP } from "../../stores/ViewBox.js";

	$: showVertices = $Tool
		&& ($Tool.key === "select"
		|| $Tool.key === "vertex"
		|| $Tool.key === "translate"
		|| $Tool.key === "scale");

	const padViewport = (view, pad) => {
		const p = Math.max(view[2], view[3]) * pad;
		return [view[0] - p, view[1] - p, view[2] + p * 2, view[3] + p * 2];
	};

	$: viewport = padViewport($ViewportCP, 0.05);
	// $: viewport = padViewport($ViewportCP, 0.05).map(n => n / ArtificialScale);
	// $: console.log("viewport", viewport);

	$: invertVertical = $VerticalUp;
</script>

<SVGTouchCanvas
	viewBox={viewport.join(" ")}
	strokeWidth={$StrokeWidthCreasePattern}
	scale={ArtificialScale}
	{invertVertical}
	on:press
	on:move
	on:release
	on:scroll>
	{#if $ShowGrid}
		<GridLayer {viewport} />
	{/if}
	<g class="origami-layer">
		<FacesLayer
			graph={$CreasePattern}
			selected={$Selection.faces}
			highlighted={$Highlight.faces} />
		<EdgesLayer
			graph={$CreasePattern}
			selected={$Selection.edges}
			highlighted={$Highlight.edges}
			strokeWidth={$StrokeWidthCreasePattern}
			strokeDasharray={$StrokeDashLengthCreasePattern}
			/>
		{#if showVertices}
			<VerticesLayer
				graph={$CreasePattern}
				selected={$Selection.vertices}
				highlighted={$Highlight.vertices} />
		{/if}
	</g>
	{#if $ShowAxes}
		<AxesLayer {viewport} />
	{/if}
	{#if $ShowFlatFoldableIssues}
		<FoldableVertices graph={$CreasePattern} />
	{/if}
	<g class="layer-tools" style={`--stroke-dash-length: ${$StrokeDashLengthCreasePattern};`}>
		<RulerLayer {viewport} />
		<UILayer />
		{#if $Tool && $Tool.SVGLayer}
			<svelte:component this={$Tool.SVGLayer} />
		{/if}
	</g>
	{#if $ShowIndices}
		<GraphIndices graph={$CreasePattern} {invertVertical} />
	{/if}
</SVGTouchCanvas>
