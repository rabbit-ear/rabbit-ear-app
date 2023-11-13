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
	import {
		CreasePattern,
		CPFacesWinding,
	} from "../../stores/ModelCP.js";
	import {
		FoldedFacesWinding,
		Faces2DDrawOrder,
	} from "../../stores/ModelFolded.js"
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
		StrokeWidthCreasePattern,
		StrokeDashLengthCreasePattern,
		VertexRadiusCP,
	} from "../../stores/Style.js";
	import { ViewportCP } from "../../stores/ViewBox.js";
	import { RulersCP } from "../../stores/Ruler.js";
	import { GuideLinesCP } from "../../stores/UI.js";

	const padViewport = (view, pad) => {
		const p = Math.max(view[2], view[3]) * pad;
		return [view[0] - p, view[1] - p, view[2] + p * 2, view[3] + p * 2];
	};

	$: showVertices = $Tool
		&& ($Tool.key === "select"
		|| $Tool.key === "inspect"
		|| $Tool.key === "vertex"
		|| $Tool.key === "translate"
		|| $Tool.key === "scale");

	$: viewport = padViewport($ViewportCP, 0.05);
	// $: viewport = padViewport($ViewportCP, 0.05).map(n => n / ArtificialScale);
	// $: console.log("viewport", viewport);

	// $: scaledGraph = {
	// 	...$CreasePattern,
	// 	vertices_coords: $CreasePattern.vertices_coords
	// 		.map(coords => coords.map(n => n * 100))
	// };

	let showRulers = true;
	$: showRulers = $Tool
		&& $Tool.name !== "edge"
		&& $Tool.name !== "folded line"

	$: rulers = showRulers ? $RulersCP.concat($GuideLinesCP) : [];
</script>

<SVGTouchCanvas
	viewBox={viewport.join(" ")}
	strokeWidth={$StrokeWidthCreasePattern}
	invertVertical={$VerticalUp}
	on:press
	on:move
	on:release
	on:exit
	on:scroll>
	{#if $ShowGrid}
		<GridLayer {viewport} />
	{/if}
	<!-- <g class="origami-layer" style={`transform: matrix(0.01, 0, 0, 0.01, 0, 0);`}> -->
	<!-- <g class="origami-layer"> -->
	<FacesLayer
		graph={$CreasePattern}
		winding={$CPFacesWinding}
		frontBack={$FoldedFacesWinding}
		drawOrder={$Faces2DDrawOrder}
		selected={$Selection.faces}
		highlighted={$Highlight.faces} />
	{#if $ShowFlatFoldableIssues}
		<FoldableVertices graph={$CreasePattern} />
	{/if}
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
			radius={$VertexRadiusCP}
			selected={$Selection.vertices}
			highlighted={$Highlight.vertices} />
	{/if}
	<!-- </g> -->
	{#if $ShowAxes}
		<AxesLayer {viewport} />
	{/if}
	<g class="layer-tools" style={`--stroke-dash-length: ${$StrokeDashLengthCreasePattern};`}>
		<RulerLayer {viewport} {rulers} />
		<UILayer />
		{#if $Tool && $Tool.cp && $Tool.cp.SVGLayer}
			<svelte:component this={$Tool.cp.SVGLayer} />
		{/if}
	</g>
	{#if $ShowIndices}
		<GraphIndices
			graph={$CreasePattern}
			invertVertical={$VerticalUp} />
	{/if}
</SVGTouchCanvas>
