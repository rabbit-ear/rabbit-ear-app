<script>
	import { onMount, onDestroy } from "svelte";
	import { foldToViewBox } from "rabbit-ear/svg/general/viewBox.js";
	import Pages from "./Pages.svelte";
	import WebGLRender from "../WebGLCanvas/WebGLRender.svelte";
	import {
		ImportedFileFOLDPreview,
	} from "../../stores/File.js";

	$: viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
</script>

<h1>Import OBJ File</h1>

<div class="webgl-preview">
	<WebGLRender graph={$ImportedFileFOLDPreview} {viewMatrix} />
</div>

<style>
	.webgl-preview {
		width: 12rem;
		height: 12rem;
		margin: auto;
	}
</style>
