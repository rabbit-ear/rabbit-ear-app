<script>
	import SVGCanvas from "./SVGCanvas.svelte";
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesCPLayer from "./FacesCPLayer.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import FlatFoldable from "./FlatFoldable.svelte";
	import { CreasePattern } from "../../stores/Model.js";
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
	import { StrokeDashLength } from "../../stores/Style.js";
</script>

<SVGCanvas on:press on:move on:release on:scroll>
	{#if $ShowGrid}
		<GridLayer />
	{/if}
	<g class="origami-layer">
		<FacesCPLayer
			graph={$CreasePattern}
			selected={$Selection.faces}
			highlighted={$Highlight.faces} />
		<EdgesLayer
			graph={$CreasePattern}
			selected={$Selection.edges}
			highlighted={$Highlight.edges} />
		<!-- <VerticesLayer
			graph={$CreasePattern}
			selected={$Selection.vertices}
			highlighted={$Highlight.vertices} /> -->
	</g>
	{#if $ShowAxes}
		<AxesLayer />
	{/if}
	{#if $ShowFlatFoldableIssues}
		<FlatFoldable graph={$CreasePattern} />
	{/if}
	<g class="layer-tools" style={`--stroke-dash-length: ${$StrokeDashLength};`} >
		<RulerLayer />
		<UILayer />
		{#if $Tool && $Tool.SVGLayer}
			<svelte:component this={$Tool.SVGLayer} />
		{/if}
	</g>
	{#if $ShowIndices}
		<GraphIndices graph={$CreasePattern} />
	{/if}
</SVGCanvas>
