<script>
	import { onMount, onDestroy } from "svelte";
	import { foldToViewBox } from "rabbit-ear/svg/general/viewBox.js";
	import Pages from "./Pages.svelte";
	import WebGLRender from "../WebGLCanvas/WebGLRender.svelte";
	import {
		ImportFilePreview,
		ImportFileOptions,
	} from "../../stores/File.js";

	$: viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

</script>

<h1>Import OBJ File</h1>

<div class="webgl-preview">
	<WebGLRender graph={$ImportFilePreview} {viewMatrix} />
</div>

<style>
	input[type=text], input[type=range] {
		width: 100%;
	}
	p {
		max-width: 12rem;
		margin: auto;
	}
	.webgl-preview {
		width: 12rem;
		height: 12rem;
		margin: auto;
	}
	.vertices circle {
		fill: var(--highlight);
		opacity: 0.666;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.gap {
		gap: 0.5rem;
	}
	.number {
		font-weight: bold;
	}
	.explain {
		font-style: italic;
		color: var(--dim);
	}
</style>
