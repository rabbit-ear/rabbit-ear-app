<script>
	import GraphVerticesLayer from "./GraphVerticesLayer.svelte";
	import GraphEdgesLayer from "./GraphEdgesLayer.svelte";
	import GraphFacesLayer from "./GraphFacesLayer.svelte";
	import { ViewBox } from "../../stores/ViewBox.js";
	import { UIGraph } from "../../stores/UI.js";

	let vmax;
	$: vmax = Math.max($ViewBox[2], $ViewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);

	let strokeWidths;
	$: strokeWidths = $UIGraph.edges_vertices
		? $UIGraph.edges_vertices.map(() => vmax * 0.005)
		: [];

	let scales;
	$: scales = $UIGraph.vertices_coords
		? $UIGraph.vertices_coords.map(() => 1.5)
		: [];
</script>

<g>
	<g class="graph-preview">
		<GraphFacesLayer
			graph={$UIGraph}
		/>
		<GraphEdgesLayer
			graph={$UIGraph}
			strokeWidths={strokeWidths}
		/>
		<GraphVerticesLayer
			graph={$UIGraph}
			scales={scales}
		/>
	</g>
</g>
