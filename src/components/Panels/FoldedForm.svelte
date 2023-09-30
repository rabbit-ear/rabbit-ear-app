<script>
	import Panel from "./Panel.svelte";
	import {
		Graph,
	} from "../../stores/Model.js";
	import { executeCommand } from "../../kernel/execute.js";

	$: faceOrders = $Graph && $Graph.faceOrders ? $Graph.faceOrders : [];
</script>

<Panel>
	<span slot="title">Folded</span>
	<span slot="body">
		<div class="flex-row">
			<p>face orders: <span class="number">{faceOrders.length}</span></p>
		</div>
		<button on:click={() => executeCommand("makeFaceOrders")}>solve layer order</button>
	</span>
</Panel>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.gap {
		gap: 0.333rem;
	}
	.number {
		font-weight: bold;
	}
</style>
