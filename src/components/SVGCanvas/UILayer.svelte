<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { UIGraph } from "../../stores/UI.js";
</script>

<g class="graph-preview-layer">
	<GraphFacesLayer graph={$UIGraph} />
	<GraphEdgesLayer graph={$UIGraph} />
	<GraphVerticesLayer graph={$UIGraph} />
</g>
