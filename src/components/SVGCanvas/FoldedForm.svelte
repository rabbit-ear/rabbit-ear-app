<script>
	import SVGCanvas from "./SVGCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
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
	import { Tool } from "../../stores/UI.js";
</script>

<SVGCanvas on:press on:move on:release on:scroll>
	{#if $ShowGrid}
		<GridLayer />
	{/if}
	<GraphLayer graph={$GraphFolded} />
	{#if $ShowAxes}
		<AxesLayer />
	{/if}
	{#if $ShowIndices}
		<GraphIndices graph={$GraphFolded} />
	{/if}
</SVGCanvas>
