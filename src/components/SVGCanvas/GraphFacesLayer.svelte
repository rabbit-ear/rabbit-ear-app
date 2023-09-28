<script>
	import { GraphFacesWinding } from "../../stores/Model.js";
	export let graph = {};
	export let selected = [];
	export let highlighted = [];

	let selectedHash = {};
	$: {
		selectedHash = {};
		selected.forEach(f => { selectedHash[f] = true; });
	};

	let highlightedHash = [];
	$: {
		highlightedHash = [];
		highlighted.forEach(i => { highlightedHash[i] = true; });
	};

	let polygonsPoints = [];
	$: polygonsPoints = !graph.faces_vertices
		? []
		: graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v].slice(0, 2).join(",")))
			.map(points => points.join(" "));

	let classes = [];
	$: classes = polygonsPoints.map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
		$GraphFacesWinding[i] ? "front" : "back",
	].filter(a => a !== undefined).join(" "));

	let polygons = [];
	$: polygons = polygonsPoints
		.map((points, i) => ({ points, class: classes[i] }));
</script>

{#each polygons as polygon}
	<polygon {...polygon} />
{/each}
