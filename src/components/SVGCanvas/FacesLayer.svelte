<script>
	import { joinSelectedHighlighted } from "./attributes.js";
	import { svgNumber } from "../../js/epsilon.js";

	export let graph = {};
	export let selected = [];
	export let highlighted = [];

	export let frontBack = [];
	export let winding = [];
	export let drawOrder = [];

	$: selectedHighlighted = joinSelectedHighlighted(selected, highlighted);

	let facesPoints = [];
	$: facesPoints = !graph || !graph.faces_vertices
		? []
		: graph.faces_vertices
			.filter(fv => fv.reduce((prev, v) => prev && graph.vertices_coords[v], true))
			.map(fv => fv
				.map(v => graph.vertices_coords[v].slice(0, 2))
				.map(points => points.map(svgNumber))
				.map(points => points.join(",")))
			.map(points => points.join(" "));

	let facesClass = [];
	$: facesClass = facesPoints.map((_, i) => [
		winding[i] === false ? "clockwise" : "counter-clockwise",
		frontBack[i] ? "front" : "back",
		drawOrder.length ? undefined : "transparent",
		...(selectedHighlighted[i] || []),
	].filter(a => a !== undefined).join(" "));

	let polygons = [];
	$: polygons = drawOrder.length
		? drawOrder.map(f => ({ points: facesPoints[f], class: facesClass[f] }))
		: facesPoints.map((points, f) => ({ points, class: facesClass[f] }));
</script>

<g class="faces">
	{#each polygons as polygon}
		<polygon {...polygon} />
	{/each}
</g>
