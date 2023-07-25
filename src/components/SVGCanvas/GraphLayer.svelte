<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { Graph } from "../../stores/Graph.js";
	import {
		Selection,
		Highlight,
	} from "../../stores/Select.js";
	import { StrokeWidth } from "../../stores/Style.js";
	import { Tool, ToolStep } from "../../stores/Tool.js";
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

	const showVertices = (tool, toolStep) => {
		switch (tool) {
			case TOOL_SELECT:
			case TOOL_SPLIT_EDGE:
			case TOOL_EDGE:
			case TOOL_VERTEX:
			case TOOL_AXIOM_1:
			case TOOL_AXIOM_2:
			case TOOL_KAWASAKI:
				return true;
			case TOOL_AXIOM_3:
				return toolStep > 1;
			case TOOL_AXIOM_4:
				switch (toolStep) {
				case 0: return false;
				default: return true;
				}
			case TOOL_AXIOM_5:
				switch (toolStep) {
				case 0: return true;
				case 1: return false;
				default: return true;
				}
			case TOOL_AXIOM_6:
				switch (toolStep) {
				case 0: return true;
				case 1: return false;
				case 2: return true;
				default: return false;
				}
			case TOOL_AXIOM_7:
				switch (toolStep) {
				case 0: return true;
				default: return false;
				}
		}
	}

	let facesFill = [];
	let edgesStroke = [];
	let edgesStrokeWidth = [];
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
		edgesStrokeWidth = [];
		$Highlight.edges.forEach(i => { edgesStrokeWidth[i] = $StrokeWidth * 3; });
	};

	$: {
		verticesFill = [];
		$Selection.vertices.forEach(i => { verticesFill[i] = "#fb4"; });
	};

</script>

<g>
	<GraphFacesLayer graph={$Graph} fills={facesFill} />
	<GraphEdgesLayer
		graph={$Graph}
		strokes={edgesStroke}
		strokeWidths={edgesStrokeWidth}
	/>
	{#if showVertices($Tool, $ToolStep)}
		<GraphVerticesLayer graph={$Graph} fills={verticesFill} />
	{/if}
</g>
