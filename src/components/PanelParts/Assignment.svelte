<script>
	import { edgesAssignmentNames } from "rabbit-ear/fold/spec.js";
	import { NewEdgeAssignment } from "../../stores/App.js";

	// const options = ["U", "V", "M", "F", "B", "C"];
	const options = ["B", "V", "M", "F", "C", "U"];
</script>

<p>new edges are: <span class="bold">{edgesAssignmentNames[$NewEdgeAssignment]}</span></p>
<div class="flex-row">
	{#each options as assign}
		<button
			class={$NewEdgeAssignment === assign ? "highlighted" : ""}
			on:click={() => $NewEdgeAssignment = assign }>{assign}</button>
	{/each}
</div>
<!-- <select bind:value={$NewEdgeAssignment}>
	{#each options as option, i}
		<option value={option}>{edgesAssignmentNames[option]}</option>
	{/each}
</select> -->

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		margin: 0.5rem 0;
	}
	button {
		flex: 1;
		height: 1.5rem;
	}
	button.highlighted {
		background-color: var(--uiblue);
	}
	.bold {
		font-weight: bold;
	}
</style>