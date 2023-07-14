<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { Graph } from "../../stores/Graph.js";
	import { Selection } from "../../stores/Select.js";
	import { Tool } from "../../stores/Tool.js";
	import {
		TOOL_SELECT,
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
		[TOOL_SELECT]: true,
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

	let facesFill = [];
	let edgesStroke = [];
	let verticesFill = [];

	$: {
		facesFill = [];
		$Selection.faces.forEach(i => { facesFill[i] = "#fb44"; });
	};

	$: {
		edgesStroke = [];
		$Selection.edges.forEach(i => { edgesStroke[i] = "#fb4"; });
	};

	$: {
		verticesFill = [];
		$Selection.vertices.forEach(i => { verticesFill[i] = "#fb4"; });
	};

</script>

<g>
	<GraphFacesLayer graph={$Graph} fills={facesFill} />
	<GraphEdgesLayer graph={$Graph} strokes={edgesStroke} />
	{#if showVertices[$Tool]}
		<GraphVerticesLayer graph={$Graph} fills={verticesFill} />
	{/if}
</g>
