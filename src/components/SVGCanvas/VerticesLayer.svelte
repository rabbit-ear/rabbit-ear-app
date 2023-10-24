<script>
	import { joinSelectedHighlighted } from "./attributes.js";

	export let graph = {};
	export let radius = 0.02;
	export let selected = [];
	export let highlighted = [];

	$: selectedHighlight = joinSelectedHighlighted(selected, highlighted);

	let coords = [];
	$: coords = (!graph.vertices_coords ? [] : graph.vertices_coords)
		.map(coord => ({ cx: coord[0], cy: coord[1] }));

	let radiuses = [];
	$: radiuses = coords.map((_, i) => (selectedHighlight[i]
		? radius * (5 / 3)
		: radius));

	let classes = [];
	$: classes = coords.map((_, i) => [
		"vertex",
		...(selectedHighlight[i] || []),
	].filter(a => a !== undefined).join(" "));

	let circles = [];
	$: circles = coords.map((coords, i) => ({
		...coords,
		r: radiuses[i],
		class: classes[i],
	}));
</script>

<g class="vertices">
	{#each circles as circle}
		<circle {...circle} />
	{/each}
</g>
