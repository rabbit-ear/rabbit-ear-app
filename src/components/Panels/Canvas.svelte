<script>
	import Panel from "./Panel.svelte";
	import {
		darkMode,
		autoPlanarize,
		snapping,
		viewBox,
	} from "../../stores/app.js";
	import { current } from "../../stores/ui.js";

	let viewBoxWidth = $viewBox[2];
	let viewBoxHeight = $viewBox[3];
	$: viewBox.setWidth(parseFloat(viewBoxWidth));
	$: viewBox.setHeight(parseFloat(viewBoxHeight));
	
	const formatPoint = (p) => p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(4)
		}).join(", ");
</script>

<Panel>
	<span slot="title">Canvas</span>

	<span slot="body">
		<div>
			<p>cursor</p>
			<input type="text" readonly value={$current ? formatPoint($current) : ""} >
		</div>
		<div>
			<p>canvas</p>
			<input class="half" type="text" bind:value={viewBoxWidth} >
			<input class="half" type="text" bind:value={viewBoxHeight} >
		</div>
	</span>
</Panel>

<style>
	.half { width: 40% }
</style>