<script>
	// import { onMount, onDestroy } from "svelte";
	import { foldToViewBox } from "rabbit-ear/svg/general/viewBox.js";
	import Pages from "./Pages.svelte";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import SVGColorsList from "./SVGColorsList.svelte";
	import {
		ImportFileMetadata,
		ImportFilePreview,
		ImportFileOptions,
		finishImport,
	} from "../../stores/File.js";

	let pageIndex;

	let epsilon;
	let epsilonSlider = 10;
	let assignments = $ImportFileOptions ? $ImportFileOptions.assignments : {};
	let boundary = true;

	$: console.log("assignments", assignments);
	// $: console.log("ImportFilePreview", $ImportFilePreview);

	$: epsilon = Math.pow(2, epsilonSlider) / 10000;
	// $: epsilonSlider = Math.log2(($ImportFileOptions.suggestedEpsilon) * 10000);
	$: previewViewBox = foldToViewBox($ImportFilePreview);
	$: strokeWidth = $ImportFileOptions.boundingBox
		&& $ImportFileOptions.boundingBox.span
		? Math.max($ImportFileOptions.boundingBox.span[0],
			$ImportFileOptions.boundingBox.span[0]) / 100
		: 0.01;

	let circles = [];
	$: circles = ($ImportFilePreview && $ImportFilePreview.vertices_coords
		? $ImportFilePreview.vertices_coords
		: []).map(coord => ({ cx: coord[0], cy: coord[1], r: epsilon }));

	// let bootLoop;
	// onMount(() => {
	// 	if (bootLoop) { clearInterval(bootLoop); }
	// 	bootLoop = setInterval(() => {
	// 		if ($ImportFilePreview && $ImportFileOptions) {
	// 			epsilonSlider = Math.log2(($ImportFileOptions.epsilon) * 10000);
	// 			clearInterval(bootLoop);
	// 		}
	// 	}, 50)
	// });
	// onDestroy(() => {
	// 	if (bootLoop) { clearInterval(bootLoop); }
	// });
	// onMount(() => {
	// 	epsilonSlider = Math.log2(($ImportFileOptions.epsilon) * 10000);
	// })

	const ASSIGNMENTS = {
		boundary: ["B", "b"],
		mountain: ["M", "m"],
		valley: ["V", "v"],
		flat: ["F", "f"],
		cut: ["C", "c"],
		join: ["J", "j"],
		unassigned: ["U", "u"],
	};
	let edgeSummary = "";
	$: edgeSummary = $ImportFilePreview
		&& $ImportFilePreview
		&& $ImportFilePreview.edges_assignment
		? Object.keys(ASSIGNMENTS)
			.map(key => $ImportFilePreview.edges_assignment
				.filter(a => ASSIGNMENTS[key].includes(a)).length)
			.map((count, i) => ({ count, key: Object.keys(ASSIGNMENTS)[i] }))
			.filter(el => el.count > 0)
			.map(el => `${el.key}: ${el.count}`)
		: "";
</script>


<h1>Import SVG File</h1>

<div class="svg-preview">
	<SVGCanvas
		{strokeWidth}
		viewBox={previewViewBox}
		invertVertical={$ImportFileOptions.invertVertical}>
		<EdgesLayer graph={$ImportFilePreview} {strokeWidth} />
		<g class="vertices">
			{#each circles as circle}<circle {...circle} />{/each}
		</g>
	</SVGCanvas>
</div>

<Pages names={["size", "colors", "boundary", "epsilon"]}> <!-- bind:pageIndex={pageIndex}> -->
	<div slot="0">
		<h3>dimensions</h3>
		<!-- <p>{$ImportFileOptions.boundingBox.span
			.slice(0, 2)
			.map(n => n.toFixed(3))
			.join(" × ")}</p> -->
		<input
			type="checkbox"
			id="checkbox-y-flip"
			bind:checked={$ImportFileOptions.invertVertical}>
		<label for="checkbox-y-flip">flip y-axis</label>
	</div>

	<div slot="1">
		<h3>{Object.keys(assignments).length} colors found</h3>
		<SVGColorsList bind:assignments={assignments} />
		{#each edgeSummary as summary}
			<p>{summary}</p>
		{/each}
	</div>

	<div slot="2">
		<h3>boundary</h3>
		<input type="checkbox" id="checkbox-boundary" bind:checked={boundary}><label for="checkbox-boundary">find boundary</label>
		{#if boundary}
			<p class="italic">walk around the outer boundary and reassign these edges</p>
		{:else}
			<p class="italic">all black lines will be assigned boundary</p>
		{/if}
	</div>

	<div slot="3">
		<h3>epsilon</h3>
		<p>suggested: {$ImportFileOptions.epsilon ? $ImportFileOptions.epsilon.toFixed(3) : 0}</p>
		<input type="text" bind:value={epsilon}>
		<br />
		<input
			type="range"
			min="1"
			max="20"
			step="0.01"
			bind:value={epsilonSlider}>
	</div>
</Pages>

<style>
	.svg-preview {
		width: 12rem;
		height: 12rem;
		margin: auto;
	}
	.vertices circle {
		fill: var(--highlight);
		opacity: 0.666;
	}
</style>
