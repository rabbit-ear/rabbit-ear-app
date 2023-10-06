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
		<div class="flex-column gap">
			<p class="info">select kind:</p>
			<div class="flex-row">
				<input
					type="radio"
					name="VEF"
					id="selectVertices"
					bind:group={$ElementSelect}
					value={SELECT_VERTEX} />
				<label for="selectVertices">vertices</label>
			</div>
			<div class="flex-row">
				<input
					type="radio"
					name="VEF"
					id="selectEdges"
					bind:group={$ElementSelect}
					value={SELECT_EDGE} />
				<label for="selectEdges">edges</label>
			</div>
			<div class="flex-row">
				<input
					type="radio"
					name="VEF"
					id="selectFaces"
					bind:group={$ElementSelect}
					value={SELECT_FACE} />
				<label for="selectFaces">faces</label>
			</div>
			{#if $Selection.vertices.length || $Selection.edges.length || $Selection.faces.length}
				<p class="info">selected:</p>
				{#if $Selection.vertices.length}
					<p><span class="number">{$Selection.vertices.length}</span> vertices</p>
				{/if}
				{#if $Selection.edges.length}
					<p><span class="number">{$Selection.edges.length}</span> edges</p>
				{/if}
				{#if $Selection.faces.length}
					<p><span class="number">{$Selection.faces.length}</span> faces</p>
				{/if}
			{/if}
			<p class="info">inspect:</p>
			{#if $Highlight.vertices.length}
				<p>vertex: <span class="number">{$Highlight.vertices[0]}</span></p>
			{/if}
			{#if $Highlight.edges.length}
				<p>edge: <span class="number">{$Highlight.edges[0]}</span></p>
			{/if}
			{#if $Highlight.faces.length}
				<p>face: <span class="number">{$Highlight.faces[0]}</span></p>
			{/if}
		</div>
	</span>
</Panel>

<style>
	.number {
		font-weight: bold;
	}
	.info {
		color: var(--dim);
		font-style: italic;
	}
</style>
