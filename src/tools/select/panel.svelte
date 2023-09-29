<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import {
		ElementSelect,
		SELECT_VERTEX,
		SELECT_EDGE,
		SELECT_FACE,
	} from "./stores.js";
	import { Selection } from "../../stores/Select.js";
	import { Highlight } from "../../stores/UI.js";

</script>

<Panel>
	<span slot="title">select</span>
	<span slot="body">
		<div class="container">
			<p class="info">select kind:</p>
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
			{#if $Selection.vertices.length || $Selection.edges.length || $Selection.faces.length}
				<div class="top-pad">
				<p class="info">selected:</p>
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
			{/if}
			<div class="top-pad">
				<p class="info">inspect:</p>
				{#if $Highlight.vertices.length}
					<p>vertex: <strong>{$Highlight.vertices[0]}</strong></p>
				{/if}
				{#if $Highlight.edges.length}
					<p>edge: <strong>{$Highlight.edges[0]}</strong></p>
				{/if}
				{#if $Highlight.faces.length}
					<p>face: <strong>{$Highlight.faces[0]}</strong></p>
				{/if}
			</div>
		</div>
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	strong {
		font-weight: bold;
	}
	.info {
		color: var(--dim);
		font-style: italic;
	}
	.top-pad {
		margin-top: 0.5rem;
	}
</style>
