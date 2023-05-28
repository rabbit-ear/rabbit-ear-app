<script>
	import { graph } from "../stores/graph.js";

	export const didPressAt = (e) => {
		const { point } = e.detail;
		const vertices_coords = $graph.vertices_coords;
		vertices_coords.push(point);
		$graph = {
			...$graph,
			vertices_coords,
		}
		console.log("Graph", $graph);
	};
</script>