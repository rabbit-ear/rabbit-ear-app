<script>
	import Panel from "./Panel.svelte";
	import { ModelMatrix, CameraMatrix } from "../../stores/ViewBox.js";
	import { Current } from "../../stores/UI.js";

	let zoom;
	$: {
		const value = $CameraMatrix[0] / $ModelMatrix[0];
		zoom = !isNaN(value) ? (1 / value).toFixed(3) : 0;
	};
	
	const formatPoint = (p) => p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(4)
		}).join(", ");
</script>

<Panel>
	<span slot="title">canvas</span>
	<span slot="body">
		<p>zoom: <span class="number">{zoom}</span></p>
		<div>
			<p>cursor</p>
			<input type="text" readonly value={$Current ? formatPoint($Current) : ""}>
		</div>
		<div>
			<button on:click={CameraMatrix.reset}>reset zoom</button>
		</div>
	</span>
</Panel>

<style>
	.number {
		font-weight: bold;
	}
/*	input[type=text] { width: 100%; }*/
/*	input[type=text].half { width: 50%; }*/
</style>
