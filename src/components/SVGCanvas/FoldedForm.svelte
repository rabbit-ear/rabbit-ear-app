<script>
	import SVGCanvas from "./SVGCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import FlatFoldable from "./FlatFoldable.svelte";
	import { GraphFolded } from "../../stores/Model.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowIndices,
	} from "../../stores/App.js";
	import { Selection } from "../../stores/Select.js";
	import { Highlight } from "../../stores/UI.js";
</script>

<SVGCanvas on:press on:move on:release on:scroll>
	{#if $ShowGrid}
		<GridLayer />
	{/if}
	<g class="origami-layer">
		<GraphFacesLayer
			graph={$GraphFolded}
			selected={$Selection.faces}
			highlighted={$Highlight.faces} />
		<!-- <GraphEdgesLayer
			graph={$GraphFolded}
			selected={$Selection.edges}
			highlighted={$Highlight.edges} /> -->
		<!-- <GraphVerticesLayer
			graph={$GraphFolded}
			selected={$Selection.vertices}
			highlighted={$Highlight.vertices} /> -->
	</g>
	{#if $ShowAxes}
		<AxesLayer />
	{/if}
	{#if $ShowIndices}
		<GraphIndices graph={$GraphFolded} />
	{/if}
</SVGCanvas>
