<script>
	import { Nearest } from "./stores.js";
	import {
		IsolatedFrame,
		IsoUpdateFrame,
	} from "../../stores/Model.js";

	$: isValid = $IsolatedFrame && $Nearest && $Nearest.vertex !== undefined;
	$: vertex = isValid ? $Nearest.vertex : undefined;

	$: coords = isValid
		&& $IsolatedFrame.vertices_coords
		&& $IsolatedFrame.vertices_coords.length > vertex
		? $IsolatedFrame.vertices_coords[vertex]
		: [];

	// let timeout;
	// $: {
	// 	coords;
	// 	if (timeout) {
	// 		clearTimeout(timeout);
	// 		timeout = undefined;
	// 	}
	// 	timeout = setTimeout(() => IsoUpdateFrame($IsolatedFrame), 5);
	// };
</script>

{#if isValid}
	<div class="flex-column gap">
		<p class="title">vertex</p>
		<div class="flex-column">
			{#each coords as value, i}
				<input type="number" bind:value={coords[i]} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.title {
		font-weight: bold;
		color: var(--bright);
	}
</style>
