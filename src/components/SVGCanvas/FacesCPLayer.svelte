<script>
	import {
		FacesWinding,
		Faces2DDrawOrder,
	} from "../../stores/Model.js";

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

	let facesPolygon = [];
	$: facesPolygon = !graph || !graph.faces_vertices
		? []
		: graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v].slice(0, 2).join(",")))
			.map(points => points.join(" "));

	let facesClass = [];
	$: facesClass = facesPolygon.map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
		$FacesWinding[i] ? "front" : "back",
	].filter(a => a !== undefined).join(" "));

	let polygons = [];
	$: polygons = $Faces2DDrawOrder
		.map(f => ({ points: facesPolygon[f], class: facesClass[f] }));

	// $: console.log("drawing svg faces", polygons.length);

</script>

<g class="faces">
	{#each polygons as polygon}
		<polygon {...polygon} />
	{/each}
</g>
