<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { ElementSelect } from "../../stores/UI.js";
	import { SelectHoverIndex } from "./stores.js";
	import { Selection } from "../../stores/Select.js";
	import {
		SELECT_VERTEX,
		SELECT_EDGE,
		SELECT_FACE,
	} from "../../app/keys.js";
</script>

<Panel>
	<span slot="title">select</span>
	<span slot="body">
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
			<div>
				<p>nearest</p>
				{#if $SelectHoverIndex.vertex}
					<p>vertex: <strong>{$SelectHoverIndex.vertex}</strong></p>
				{/if}
				{#if $SelectHoverIndex.edge}
					<p>edge: <strong>{$SelectHoverIndex.edge}</strong></p>
				{/if}
				{#if $SelectHoverIndex.face}
					<p>face: <strong>{$SelectHoverIndex.face}</strong></p>
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
	p {
		color: var(--dim);
/*		margin: 1rem 0 0.25rem 0;*/
		font-style: italic;
	}
</style>
