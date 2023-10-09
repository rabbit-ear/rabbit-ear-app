<script>
	// import { onMount, onDestroy } from "svelte";
	import { foldToViewBox } from "rabbit-ear/svg/general/viewBox.js";
	import Pages from "./Pages.svelte";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import {
		ImportFileMetadata,
		ImportFilePreview,
		ImportFileOptions,
		finishImport,
	} from "../../stores/File.js";

	let pageIndex;

	let epsilon;
	let epsilonSlider = 10;
	let invertVertical = false;

	$: epsilon = Math.pow(2, epsilonSlider) / 10000;
	// $: epsilonSlider = Math.log2(($ImportFileOptions.suggestedEpsilon) * 10000);
	$: previewViewBox = foldToViewBox($ImportFilePreview);
	$: strokeWidth = $ImportFileOptions.boundingBox
		&& $ImportFileOptions.boundingBox.span
		? Math.max($ImportFileOptions.boundingBox.span[0],
			$ImportFileOptions.boundingBox.span[0]) / 50
		: 0.01;

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
</script>

<h1>Import OPX File</h1>
<!-- <SVGCanvas data={$ImportedFile} {epsilon} showEpsilon={pageIndex === 1}> -->

<div class="svg-preview">
	<SVGCanvas viewBox={previewViewBox} {strokeWidth} invertVertical={$ImportFileOptions.invertVertical} >
		<EdgesLayer graph={$ImportFilePreview} {strokeWidth} />
	</SVGCanvas>
</div>

<Pages names={["size", "epsilon"]}>
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
		width: 8rem;
		height: 8rem;
		margin: auto;
	}
</style>
