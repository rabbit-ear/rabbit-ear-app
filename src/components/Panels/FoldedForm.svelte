<script>
	import Panel from "./Panel.svelte";
	import {
		IsolatedFrame,
		LayerOrderKnown,
		FrameEdgesAreFlat,
		FrameIsCreasePattern,
	} from "../../stores/Model.js";
	import { executeCommand } from "../../kernel/execute.js";

	$: faceOrders = $IsolatedFrame && $IsolatedFrame.faceOrders
		? $IsolatedFrame.faceOrders
		: [];
</script>

<Panel>
	<span slot="title">Folded</span>
	<span slot="body">
		<div class="flex-column gap">
			<p>Folded state is {$FrameEdgesAreFlat ? "2D" : "3D"}</p>
			<p>Layer order: 
				{#if $LayerOrderKnown}
					<span class="highlight">known</span>
				{:else}
					<span>unknown</span>
				{/if}
			</p>
			<div class="flex-row">
				<p>relationships: <span class="number">{faceOrders.length}</span></p>
			</div>
		</div>
		<div class="flex-row">
			{#if $LayerOrderKnown}
				<button on:click={() => executeCommand("makeFaceOrders")}>recalculate order</button>
				<button on:click={() => executeCommand("clearFaceOrders")}>remove orders</button>
			{:else}
				<button on:click={() => executeCommand("makeFaceOrders")}>solve layer order</button>
			{/if}
		</div>
	</span>
</Panel>

<style>
	.number {
		font-weight: bold;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
