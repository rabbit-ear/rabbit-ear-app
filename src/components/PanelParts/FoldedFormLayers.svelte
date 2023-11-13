<script>
	import { onMount } from "svelte";
	import { LayerGap } from "../../stores/Style.js";
	import {
		IsolatedFrame,
	} from "../../stores/Model.js";
	import {
		FoldedForm,
		FrameHasFaceOrders,
	} from "../../stores/ModelFolded.js";
	import {
		FoldedRenderer,
	} from "../../stores/Renderer.js";
	import {
		AutoSolveLayers,
		SolveLayersOnBackground,
	} from "../../stores/App.js";
	import { executeCommand } from "../../kernel/execute.js";

	$: faceOrdersPrecomputed = $IsolatedFrame && $IsolatedFrame.faceOrders;
	$: faceOrdersComputed = !faceOrdersPrecomputed && $FoldedForm && $FoldedForm.faceOrders;
	$: faceOrdersUnknown = !faceOrdersPrecomputed && !faceOrdersComputed;
	// $: faceOrdersArray = ($FoldedForm.faceOrders || []);

	let layerGapSlider = 10;
	$: $LayerGap = Math.pow(2, layerGapSlider) / 1000000;

	onMount(() => { layerGapSlider = Math.log2((0.001) * 1000000); });
</script>

<p>Layer Solver</p>
<div class="flex-row gap">
	<input
		type="checkbox"
		id="auto-solve-layers"
		bind:checked={$AutoSolveLayers}>
	<label for="auto-solve-layers">solve layers automatically</label>
</div>
<div class="flex-row gap">
	<input
		type="checkbox"
		id="background-thread"
		bind:checked={$SolveLayersOnBackground}>
	<label for="background-thread">use background thread</label>
</div>

{#if faceOrdersPrecomputed || faceOrdersComputed}
	<div class="flex-row">
		<label for="layer-gap">Gap</label>
		<input
			disabled={$FoldedRenderer !== "webgl"}
			type="range"
			min="1"
			max="20"
			step="0.01"
			id="layer-gap"
			bind:value={layerGapSlider} />
	</div>
{/if}

<hr />

{#if faceOrdersPrecomputed || faceOrdersComputed}
	<p class="strong highlight">Layers: solved</p>
{:else if faceOrdersUnknown}
	<p class="strong">Layers: unsolved</p>
{:else}
	<p class="strong">unhandled case</p>
{/if}

<p>Solution is
	{#if faceOrdersPrecomputed}
		<span class="strong">saved</span>
	{:else if faceOrdersComputed}
		<span class="strong">live-computed</span>
	{/if}
</p>

<!-- <p>relationships: <span class="strong">{faceOrdersArray.length}</span></p> -->

{#if faceOrdersPrecomputed}
	<div class="flex-row gap center">
		<button on:click={() => executeCommand("clearFaceOrders")}>clear</button>
	</div>
{:else if faceOrdersComputed}
	<div class="flex-row gap center">
		<button
			on:click={() => executeCommand("saveFaceOrders")}>save computed state</button>
	</div>
	<div class="flex-row gap">
		<p>Here, we can toggle flap arrangements</p>
	</div>
{:else if faceOrdersUnknown}
	<span class="strong"></span>
{:else}
	<span class="strong"></span>
{/if}

<!-- <button on:click={() => executeCommand("makeFaceOrders")}>recalculate</button> -->

<style>
	.strong {
		font-weight: bold;
	}
	.highlight {
		color: var(--highlight);
	}
</style>
