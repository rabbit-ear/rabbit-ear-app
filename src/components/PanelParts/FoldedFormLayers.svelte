<script>
	import { onMount } from "svelte";
	import { LayerGap } from "../../stores/Style.js";
	import {
		IsolatedFrame,
		LayerOrderKnown,
	} from "../../stores/Model.js";
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
