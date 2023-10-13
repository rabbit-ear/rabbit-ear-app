<script>
	import {
		FacesWinding,
		LayerOrderKnown,
		Faces2DDrawOrder,
	} from "../../stores/Model.js";
	import { joinSelectedHighlighted } from "./attributes.js";

	export let graph = {};
	export let selected = [];
	export let highlighted = [];

	$: selectedHighlighted = joinSelectedHighlighted(selected, highlighted);

	let facesPoints = [];
	$: facesPoints = !graph || !graph.faces_vertices
		? []
		: graph.faces_vertices
			.map(fv => fv.map(v => graph.vertices_coords[v].slice(0, 2).join(",")))
			.map(points => points.join(" "));

	let facesClass = [];
	$: facesClass = facesPoints.map((_, i) => [
		$LayerOrderKnown ? ($FacesWinding[i] ? "front" : "back") : "transparent",
		...(selectedHighlighted[i] || []),
	].filter(a => a !== undefined).join(" "));

	let polygons = [];
	$: polygons = $Faces2DDrawOrder
		.map(f => ({ points: facesPoints[f], class: facesClass[f] }));
</script>

<g class="faces">
	{#each polygons as polygon}
		<polygon {...polygon} />
	{/each}
</g>
