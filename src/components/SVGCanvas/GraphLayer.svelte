<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import {
		Selection,
		Highlight,
	} from "../../stores/Select.js";

	export let graph = {};
</script>

<g class="origami-layer">
	<GraphFacesLayer
		{graph}
		selected={$Selection.faces}
		highlighted={$Highlight.faces} />
	<GraphEdgesLayer
		{graph}
		selected={$Selection.edges}
		highlighted={$Highlight.edges} />
	<GraphVerticesLayer
		{graph}
		selected={$Selection.vertices}
		highlighted={$Highlight.vertices} />
</g>
