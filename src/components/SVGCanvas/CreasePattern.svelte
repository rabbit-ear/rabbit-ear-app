<script>
	import SVGCanvas from "./SVGCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import UILayer from "./UILayer.svelte";
	import GraphLayer from "./GraphLayer.svelte";
	import RulerLayer from "./RulerLayer.svelte";
	import AxesLayer from "./AxesLayer.svelte";
	import GraphIndices from "./GraphIndices.svelte";
	import FlatFoldable from "./FlatFoldable.svelte";
	import { Graph } from "../../stores/Model.js";
	import {
		ShowGrid,
		ShowAxes,
		ShowFlatFoldableIssues,
		ShowIndices,
	} from "../../stores/App.js";
	import { Tool } from "../../stores/UI.js";
</script>

<SVGCanvas on:press on:move on:release on:scroll>
	{#if $ShowGrid}
		<GridLayer />
	{/if}
	<GraphLayer graph={$Graph} />
	{#if $ShowAxes}
		<AxesLayer />
	{/if}
	{#if $ShowFlatFoldableIssues}
		<FlatFoldable graph={$Graph} />
	{/if}
	<RulerLayer />
	<UILayer />
	{#if $Tool && $Tool.SVGLayer}
		<svelte:component this={$Tool.SVGLayer} />
	{/if}
	{#if $ShowIndices}
		<GraphIndices graph={$Graph} />
	{/if}
</SVGCanvas>
