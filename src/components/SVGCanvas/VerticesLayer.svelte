<script>
	import { VertexRadius } from "../../stores/App.js";
	import { BoundaryColor } from "../../stores/Style.js";

	export let graph = {};
	export let selected = [];
	export let highlighted = [];

	let selectedHash = {};
	$: {
		selectedHash = {};
		selected.forEach(e => { selectedHash[e] = true; });
	};

	let highlightedHash = [];
	$: {
		highlightedHash = [];
		highlighted.forEach(i => { highlightedHash[i] = true; });
	};

	let coords = [];
	$: coords = (!graph.vertices_coords ? [] : graph.vertices_coords)
		.map(coord => ({ cx: coord[0], cy: coord[1] }));

	let radiuses = [];
	$: radiuses = coords.map((_, i) => (selectedHash[i] || highlightedHash[i]
		? $VertexRadius * (5 / 3)
		: $VertexRadius));

	let classes = [];
	$: classes = coords.map((_, i) => [
		selectedHash[i] ? "selected" : undefined,
		highlightedHash[i] ? "highlighted" : undefined,
	].filter(a => a !== undefined).join(" "));

	let circles = [];
	$: circles = coords.map((coords, i) => ({
		...coords,
		r: radiuses[i],
		...(classes[i] === "" ? {} : { class: classes[i] }),
	}));
</script>

<g class="vertices">
	{#each circles as circle}
		<circle {...circle} fill={$BoundaryColor} />
	{/each}
</g>

<style>
	circle {
		stroke: none;
	}
</style>