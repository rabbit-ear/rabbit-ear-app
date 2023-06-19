<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
</script>

<g>
	<GraphFacesLayer />
	<GraphEdgesLayer />
	<GraphVerticesLayer />
</g>
