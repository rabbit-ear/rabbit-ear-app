<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { graph } from "../../stores/graph.js";
	import { selected } from "../../stores/select.js";
	import {
		tool,
		elementSelect,
	} from "../../stores/app.js";
	import {
		SELECT_VERTEX,
		TOOL_VERTEX,
		TOOL_SPLIT_EDGE,
	} from "../../app/keys.js";

	let showVertices;
	$: showVertices = ($elementSelect === SELECT_VERTEX
		|| $tool === TOOL_SPLIT_EDGE
		|| $tool === TOOL_VERTEX);
</script>

<g>
	<GraphFacesLayer graph={$graph} highlighted={$selected.faces} />
	<GraphEdgesLayer graph={$graph} highlighted={$selected.edges} />
	{#if showVertices}
		<GraphVerticesLayer graph={$graph} highlighted={$selected.vertices} />
	{/if}
</g>
