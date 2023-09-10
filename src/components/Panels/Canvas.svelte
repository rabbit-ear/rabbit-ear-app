<script>
	import Panel from "./Panel.svelte";
	import {
		ModelMatrix,
		CameraMatrix,
		AutoSizeModelMatrix,
	} from "../../stores/ViewBox.js";
	import {
		Pointer,
		// PointerSnap,
	} from "../../stores/UI.js";

	let zoom;
	$: {
		const value = $CameraMatrix[0] / $ModelMatrix[0];
		zoom = !isNaN(value) ? (1 / value).toFixed(3) : 0;
	};

	let isSnapped = false;
	// $: isSnapped = $PointerSnap !== undefined;

	const formatPoint = (p) => p === undefined ? "" : p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(4)
		}).join(", ");

	const NotUndefined = (...args) => args
		.filter(a => a !== undefined)
		.shift();
</script>

<Panel>
	<span slot="title">canvas</span>
	<span slot="body">
		<p>zoom: <span class="number">{zoom}</span></p>
		<button on:click={CameraMatrix.reset}>reset zoom</button>
		<br />
		<input type="checkbox" bind:checked={$AutoSizeModelMatrix} id="auto-model-matrix"><label for="auto-model-matrix">follow model changes</label>
		<hr />
		<p>cursor</p>
		<!-- <input type="text" readonly value={formatPoint(NotUndefined($PointerSnap, $Pointer))}> -->
		<input type="text" readonly value={formatPoint($Pointer)}>
		{#if isSnapped}
			<p class="alert">snapped</p>
		{:else}
			<p class="dim">not snapped</p>
		{/if}
	</span>
</Panel>

<style>
	.number {
		font-weight: bold;
	}
	.alert {
		color: var(--highlight);
	}
	.dim {
		color: var(--dim);
	}
	input[type=text] {
		width: 100%;
	}
</style>
