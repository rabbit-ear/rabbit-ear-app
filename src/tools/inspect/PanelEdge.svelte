<script>
	import { Nearest } from "./stores.js";
	import {
		IsolatedFrame,
		IsoUpdateFrame,
	} from "../../stores/Model.js";

	$: isValid = $IsolatedFrame && $Nearest && $Nearest.edge !== undefined;
	$: edge = isValid ? $Nearest.edge : undefined;

	$: vertices = isValid
		&& $IsolatedFrame.edges_vertices
		&& $IsolatedFrame.edges_vertices.length > edge
		? $IsolatedFrame.edges_vertices[edge]
		: [];
	$: assignment = isValid
		&& $IsolatedFrame.edges_assignment
		&& $IsolatedFrame.edges_assignment.length > edge
		? $IsolatedFrame.edges_assignment[edge]
		: [];
	$: foldAngle = isValid
		&& $IsolatedFrame.edges_foldAngle
		&& $IsolatedFrame.edges_foldAngle.length > edge
		? $IsolatedFrame.edges_foldAngle[edge]
		: [];

</script>

{#if isValid}
	<div class="flex-column gap">
		<p class="title">edge</p>
		<div class="flex-row gap">
			<p>assignment:</p>
			{#if isValid}
				<input type="text" bind:value={assignment} />
			{/if}
		</div>
		<div class="flex-row gap">
			<p>fold angle:</p>
			{#if isValid}
				<input type="number" bind:value={foldAngle} />
			{/if}
		</div>
		<div class="flex-row gap">
			<p>vertices: <span class="strong">{vertices.join(", ")}</span></p>
		</div>
	</div>
{/if}

<style>
	input {
		width: 100%;
	}
	p {
		flex-shrink: 0;
	}
	.title {
		font-weight: bold;
		color: var(--bright);
	}
	.strong {
		font-weight: bold;
	}
</style>
