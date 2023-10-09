<script>
	import { edgesAssignmentNames } from "rabbit-ear/fold/spec.js";
	export let assignments = {};
	const allAssignments = ["B", "M", "V", "F", "J", "C", "U"];
</script>

<div class="container">
	{#each Object.keys(assignments) as stroke, i}
		<div>
			<select bind:value={assignments[stroke]} style="border-color: {stroke};">
				{#each allAssignments as assign}
					<option value={assign}>
						{edgesAssignmentNames[assign]}
					</option>
				{/each}
			</select>
			<span>{stroke}</span>
		</div>
	{/each}
</div>

<style>
	:global(body) span { color: #333; }
	:global(body.dark) span { color: #bbb; }
	:global(body) select {
		color: initial;
		background-color: initial;
	}
	:global(body.dark) select {
		color: #bbb;
		background-color: #222;
	}
	.container {
		max-height: 10rem;
		overflow-y: scroll;
	}
	span {
		font-weight: bold;
		margin-left: 0.5rem;
	}
	select {
		border: 4px solid;
		padding: 0.15rem;
		border-radius: 0.25rem;
	}
</style>
