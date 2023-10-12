<script>
	import Panel from "./Panel.svelte";
	import {
		IsolatedFrame,
		LayerOrderKnown,
		FrameEdgesAreFlat,
		FrameIsCreasePattern,
		VerticesFlatFoldable,
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
			<p>Vertices are
				{#if $VerticesFlatFoldable && $FrameEdgesAreFlat}
					<span class="good">flat-foldable</span>
				{:else}
					<span class="bad">not flat-foldable</span>
				{/if}
			</p>
			{#if $FrameEdgesAreFlat}
				<p>All edges are flat</p>
			{:else}
				<p>Some edges are <span class="strong">3D</span></p>
			{/if}
			<p>Folded state is <span class="strong">{$FrameEdgesAreFlat ? "2D" : "3D"}</span></p>
			<hr />
			<p>Layer order is 
				{#if $LayerOrderKnown}
					<span class="highlight">known</span>
				{:else}
					<span class="strong">unknown</span>
				{/if}
			</p>
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
		</div>
	</span>
</Panel>

<style>
	.good {
	}
	.strong {
		font-weight: bold;
	}
	.bad {
		font-weight: bold;
		color: var(--red);
	}
	.strong {
		font-weight: bold;
	}
	.highlight {
		font-weight: bold;
		color: var(--highlight);
	}
</style>
