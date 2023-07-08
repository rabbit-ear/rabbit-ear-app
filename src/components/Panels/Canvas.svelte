<script>
	import Panel from "./Panel.svelte";
	import {
		darkMode,
		autoPlanarize,
		snapping,
	} from "../../stores/app.js";
	import { viewBox } from "../../stores/viewBox.js";
	import { current } from "../../stores/ui.js";

	let viewBoxWidth = $viewBox[2];
	let viewBoxHeight = $viewBox[3];
	// $: viewBox.setWidth(parseFloat(viewBoxWidth));
	// $: viewBox.setHeight(parseFloat(viewBoxHeight));
	
	const formatPoint = (p) => p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(4)
		}).join(", ");
</script>

<Panel>
	<span slot="title">canvas</span>
	<span slot="body">
		<div>
			<p>cursor</p>
			<input type="text" readonly value={$current ? formatPoint($current) : ""}>
		</div>
		<div>
			<p>canvas</p>
			<input class="half" type="text" bind:value={viewBoxWidth}><input class="half" type="text" bind:value={viewBoxHeight}>
		</div>
	</span>
</Panel>

<style>
	input[type=text] { width: 100%; }
	input[type=text].half { width: 50%; }
</style>
