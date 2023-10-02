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
		<div class="flex-column">
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
		{#if $LayerOrderKnown}
			<button on:click={() => executeCommand("makeFaceOrders")}>recalculate order</button>
			<button on:click={() => executeCommand("clearFaceOrders")}>remove orders</button>
		{:else}
			<button on:click={() => executeCommand("makeFaceOrders")}>solve layer order</button>
		{/if}
	</span>
</Panel>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	/*.flex-column {
		display: flex;
		flex-direction: column;
	}
	.gap {
		gap: 0.333rem;
	}*/
	.number {
		font-weight: bold;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
