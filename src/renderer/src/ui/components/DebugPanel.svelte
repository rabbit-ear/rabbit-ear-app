<script lang="ts">
	import app from "../../app/App.svelte.ts";
	import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
	import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";

	const logModel = () => {
		console.log($state.snapshot(app.model.shapes));
	};
	const newSVG = () => {
		app.ui?.viewports.push(new SVGViewport());
	};
	const newWebGL = () => {
		app.ui?.viewports.push(new WebGLViewport());
	};
	const removeView = () => {
		app.ui?.viewports.pop();
	};

	const toggleSVGHandedness = () => {
		SVGViewport.settings.rightHanded = !SVGViewport.settings.rightHanded;
	};
	//<input type="checkbox" id="verticalUp" checked={renderer.view.verticalUp}/>
</script>

<hr />
<p>debug</p>

<label for="verticalUp">Y axis</label>
<button onclick={logModel}>model</button>

<hr />
<p>viewport</p>
<button onclick={newSVG}>+ SVG</button>
<button onclick={newWebGL}>+ GL</button>
<button onclick={removeView}>- view</button>

<hr />

<button onclick={toggleSVGHandedness}>y flip</button>

<style>
	button {
		width: 100%;
		margin: 0;
		padding: 0.5rem;
	}
	p {
		margin: 0;
		padding: 0;
		opacity: 0.8;
		font-style: italic;
		font-weight: bold;
	}
</style>
