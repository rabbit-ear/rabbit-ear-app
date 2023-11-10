<script>
	import { onMount } from "svelte";
	import { LayerGap } from "../../stores/Style.js";
	import { IsolatedFrame } from "../../stores/Model.js";
	import { LayerOrderKnown } from "../../stores/ModelFolded.js";
	import {
		FoldedRenderer,
	} from "../../stores/Renderer.js";
	import {
		AutoSolveLayers,
		SolveLayersOnBackground,
	} from "../../stores/App.js";
	import { executeCommand } from "../../kernel/execute.js";

	$: faceOrders = $IsolatedFrame && $IsolatedFrame.faceOrders
		? $IsolatedFrame.faceOrders
		: [];

	let layerGapSlider = 10;
	$: $LayerGap = Math.pow(2, layerGapSlider) / 1000000;

	onMount(() => { layerGapSlider = Math.log2((0.001) * 1000000); });
</script>

<p>Layer order is 
	{#if $LayerOrderKnown}
		<span class="highlight">known</span>
	{:else}
		<span class="strong">unknown</span>
	{/if}
</p>
{#if $LayerOrderKnown}
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
<div class="flex-row">
	<p>relationships: <span class="strong">{faceOrders.length}</span></p>
</div>
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
<div class="flex-row gap center">
	{#if $LayerOrderKnown}
		<button on:click={() => executeCommand("makeFaceOrders")}>recalculate</button>
		<button on:click={() => executeCommand("clearFaceOrders")}>clear</button>
	{:else}
		<button on:click={() => executeCommand("makeFaceOrders")}>solve layer order</button>
	{/if}
</div>

<style>
	.strong {
		font-weight: bold;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
