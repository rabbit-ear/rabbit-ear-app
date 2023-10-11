<script>
	import { edgesAssignmentNames } from "rabbit-ear/fold/spec.js";
	import { NewEdgeAssignment } from "../../stores/App.js";

	const options = ["B", "V", "M", "F", "C", "U"];
</script>

<div class="flex-column gap">
	<p>new edges are: <span class="bold">{edgesAssignmentNames[$NewEdgeAssignment]}</span></p>
	<div class="toggle-row">
		{#each options as assign}
			<button
				class={$NewEdgeAssignment === assign ? "highlighted" : ""}
				on:click={() => $NewEdgeAssignment = assign }>{assign}</button>
		{/each}
	</div>
</div>

<style>
	button {
		margin: 0;
		padding: 0;
		flex: 1;
		height: 1.5rem;
		background-color: var(--background-4);
	}
	button.highlighted {
		background-color: var(--uiblue);
	}
	button:hover {
		background-color: var(--background-3);
	}
	button.highlighted:hover {
		background-color: var(--uidarkblue);
	}

	.bold {
		font-weight: bold;
	}
</style>