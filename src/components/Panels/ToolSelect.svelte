<script>
	import { ElementSelect } from "../../stores/Tool.js";
	import { Selection } from "../../stores/Select.js";
	import {
		SELECT_VERTEX,
		SELECT_EDGE,
		SELECT_FACE,
	} from "../../app/keys.js";
</script>

<div class="container">
	<p>select kind:</p>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectVertices"
			bind:group={$ElementSelect}
			value={SELECT_VERTEX} />
		<label for="selectVertices">vertices</label>
	</div>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectEdges"
			bind:group={$ElementSelect}
			value={SELECT_EDGE} />
		<label for="selectEdges">edges</label>
	</div>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectFaces"
			bind:group={$ElementSelect}
			value={SELECT_FACE} />
		<label for="selectFaces">faces</label>
	</div>
	<div>
		{#if $Selection.vertices.length}
			<p><strong>{$Selection.vertices.length}</strong> vertices</p>
		{/if}
		{#if $Selection.edges.length}
			<p><strong>{$Selection.edges.length}</strong> edges</p>
		{/if}
		{#if $Selection.faces.length}
			<p><strong>{$Selection.faces.length}</strong> faces</p>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	strong {
		font-weight: bold;
	}
	p {
		color: var(--dim);
/*		margin: 1rem 0 0.25rem 0;*/
		font-style: italic;
	}
</style>
