<script>
	import Panel from "./Panel.svelte";
	import { ModelMatrix, CameraMatrix } from "../../stores/ViewBox.js";
	// import { Current } from "../../stores/UI.js";

	// todo check this is correct. we are inferring zoom level of a matrix
	let zoom;
	$: {
		const value = $ModelMatrix[0] * $CameraMatrix[0];
		zoom = !isNaN(value) ? value.toFixed(3) : 0;
	};

	// const reset = () => {
	// 	CameraMatrix.reset();
	// 	ModelMatrix.reset();
	// };
	
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
		<!-- <input type="text" class="half" bind:value={zoom}> -->
		<!-- <div>
			<p>cursor</p>
			<input type="text" readonly value={$Current ? formatPoint($Current) : ""}>
		</div> -->
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
