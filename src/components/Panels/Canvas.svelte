<script>
	import Panel from "./Panel.svelte";
	import { ViewBox } from "../../stores/ViewBox.js";
	import { Current } from "../../stores/UI.js";

	let viewBoxWidth = $ViewBox[2];
	let viewBoxHeight = $ViewBox[3];
	// $: ViewBox.setWidth(parseFloat(viewBoxWidth));
	// $: ViewBox.setHeight(parseFloat(viewBoxHeight));
	
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
			<input type="text" readonly value={$Current ? formatPoint($Current) : ""}>
		</div>
		<div>
			<p>canvas</p>
			<input class="half" type="text" bind:value={viewBoxWidth}><input class="half" type="text" bind:value={viewBoxHeight}>
		</div>
		<hr />
		<button>re-center</button>
	</span>
</Panel>

<style>
	input[type=text] { width: 100%; }
	input[type=text].half { width: 50%; }
</style>
