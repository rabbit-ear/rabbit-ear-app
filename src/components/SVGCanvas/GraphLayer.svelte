<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { graph } from "../../stores/graph.js";
	import { selected } from "../../stores/select.js";
	import {
		tool,
		elementSelect,
	} from "../../stores/tool.js";
	import {
		SELECT_VERTEX,
		TOOL_VERTEX,
		TOOL_EDGE,
		TOOL_SPLIT_EDGE,
		TOOL_AXIOM_1,
		TOOL_AXIOM_2,
		TOOL_AXIOM_3,
		TOOL_AXIOM_4,
		TOOL_AXIOM_5,
		TOOL_AXIOM_6,
		TOOL_AXIOM_7,
		TOOL_KAWASAKI,
	} from "../../app/keys.js";

	let showVertices = {
		[SELECT_VERTEX]: true,
		[TOOL_SPLIT_EDGE]: true,
		[TOOL_EDGE]: true,
		[TOOL_VERTEX]: true,
		[TOOL_AXIOM_1]: true,
		[TOOL_AXIOM_2]: true,
		[TOOL_AXIOM_3]: true,
		[TOOL_AXIOM_4]: true,
		[TOOL_AXIOM_5]: true,
		[TOOL_AXIOM_6]: true,
		[TOOL_AXIOM_7]: true,
		[TOOL_KAWASAKI]: true,
	};
</script>

<g>
	<GraphFacesLayer graph={$graph} highlighted={$selected.faces} />
	<GraphEdgesLayer graph={$graph} highlighted={$selected.edges} />
	{#if showVertices[$tool]}
		<GraphVerticesLayer graph={$graph} highlighted={$selected.vertices} />
	{/if}
</g>
