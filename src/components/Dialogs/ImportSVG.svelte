<script>
	import { onMount } from "svelte";
	import { foldToViewBox } from "rabbit-ear/svg/general/viewBox.js";
	import Pages from "./Pages.svelte";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import SVGColorsList from "./SVGColorsList.svelte";
	import {
		ImportFilePreview,
		ImportFileOptions,
	} from "../../stores/File.js";
	import { niceNumber } from "../../js/epsilon.js";

	let epsilonSlider = 10;
	let assignments = {};
	let boundary = true;

	$: $ImportFileOptions.epsilon = Math.pow(2, epsilonSlider) / 10000;
	$: previewViewBox = foldToViewBox($ImportFilePreview);
	$: strokeWidth = $ImportFileOptions.boundingBox
		&& $ImportFileOptions.boundingBox.span
		? Math.max($ImportFileOptions.boundingBox.span[0],
			$ImportFileOptions.boundingBox.span[0]) / 100
		: 0.01;

	let circles = [];
	$: circles = ($ImportFilePreview && $ImportFilePreview.vertices_coords
		? $ImportFilePreview.vertices_coords
		: []).map(coord => ({ cx: coord[0], cy: coord[1], r: $ImportFileOptions.epsilon }));

	onMount(() => {
		epsilonSlider = Math.log2(($ImportFileOptions.suggestedEpsilon) * 10000);
		assignments = $ImportFileOptions.assignments;
	});
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

<Pages names={["canvas", "colors", "boundary", "epsilon"]}>
	<div slot="0" class="flex-column gap">
		<h3>canvas</h3>
		<div>
			<input
				type="checkbox"
				id="checkbox-y-flip"
				bind:checked={$ImportFileOptions.invertVertical}>
			<label for="checkbox-y-flip">flip y-axis</label>
		</div>
	</div>

	<div slot="1" class="flex-column gap">
		<h3>{Object.keys(assignments).length} colors found</h3>
		<SVGColorsList bind:assignments={assignments} />
	</div>

	<div slot="2" class="flex-column gap">
		<h3>boundary</h3>
		<p class="explain">Walk around the boundary to assign boundary edges.</p>
		<div>
			<input
				type="checkbox"
				id="checkbox-boundary"
				bind:checked={boundary}>
			<label for="checkbox-boundary">find boundary</label>
		</div>
	</div>

	<div slot="3" class="flex-column gap">
		<h3>merge distance</h3>
		<p class="explain">Touching endpoints will become one vertex.</p>
		<input
			type="range"
			min="1"
			max="20"
			step="0.01"
			id="epsilon-slider"
			bind:value={epsilonSlider}>
		<p>distance: <span class="number">{niceNumber($ImportFileOptions.epsilon)}</span></p>
		<p>suggested: <span class="number">{niceNumber($ImportFileOptions.suggestedEpsilon || 0)}</span></p>
	</div>
</Pages>

<style>
	input[type=text], input[type=range] {
		width: 100%;
	}
	p {
		max-width: 12rem;
		margin: auto;
	}
	.svg-preview {
		width: 12rem;
		height: 12rem;
		margin: auto;
	}
	.vertices circle {
		fill: var(--highlight);
		opacity: 0.666;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.gap {
		gap: 0.5rem;
	}
	.number {
		font-weight: bold;
	}
	.explain {
		font-style: italic;
		color: var(--dim);
	}
</style>
