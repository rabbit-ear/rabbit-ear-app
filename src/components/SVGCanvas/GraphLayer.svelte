<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { Graph } from "../../stores/Model.js";
	import {
		Selection,
		Highlight,
	} from "../../stores/Select.js";
</script>

<g>
	<GraphFacesLayer
		graph={$Graph}
		selected={$Selection.faces}
		highlighted={$Highlight.faces} />
	<GraphEdgesLayer
		graph={$Graph}
		selected={$Selection.edges}
		highlighted={$Highlight.edges} />
	<GraphVerticesLayer
		graph={$Graph}
		selected={$Selection.vertices}
		highlighted={$Highlight.vertices} />
</g>
