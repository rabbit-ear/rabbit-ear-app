<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import IconVertex from "./icon-vertex.svelte";
	import IconEdge from "./icon-edge.svelte";
	import IconFace from "./icon-face.svelte";
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
			<div class="flex-row gap center">
				<button
					class="svg-icon"
					on:click={() => $ElementSelect = SELECT_VERTEX}
					highlighted={$ElementSelect === SELECT_VERTEX}>
					<IconVertex />
				</button>
				<button
					class="svg-icon"
					on:click={() => $ElementSelect = SELECT_EDGE}
					highlighted={$ElementSelect === SELECT_EDGE}>
					<IconEdge />
				</button>
				<button
					class="svg-icon"
					on:click={() => $ElementSelect = SELECT_FACE}
					highlighted={$ElementSelect === SELECT_FACE}>
					<IconFace />
				</button>
			</div>
			<p>select <span class="strong">{$ElementSelect}</span></p>

			{#if $Selection.vertices.length || $Selection.edges.length || $Selection.faces.length}
				<hr />
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
			<!-- <p class="info">inspect:</p>
			{#if $Highlight.vertices.length}
				<p>vertex: <span class="number">{$Highlight.vertices[0]}</span></p>
			{/if}
			{#if $Highlight.edges.length}
				<p>edge: <span class="number">{$Highlight.edges[0]}</span></p>
			{/if}
			{#if $Highlight.faces.length}
				<p>face: <span class="number">{$Highlight.faces[0]}</span></p>
			{/if} -->
		</div>
	</span>
</Panel>

<style>
	button {
		all: unset;
		cursor: pointer;
	}
	button:hover {
		color: var(--highlight);
	}
	button:focus {
		outline-offset: 2px;
		outline: 2px solid var(--uiblue);
	}
	.strong {
		font-weight: bold;
	}
	.svg-icon {
		display: inline-block;
		height: 2.5rem;
		width: 2.5rem;
		fill: var(--dim);
		stroke: var(--dim);
	}
	.svg-icon:hover {
		fill: var(--text);
		stroke: var(--text);
	}
	.svg-icon[highlighted=true] :global(.highlightable) {
		fill: var(--highlight);
		stroke: var(--highlight);
	}
</style>
