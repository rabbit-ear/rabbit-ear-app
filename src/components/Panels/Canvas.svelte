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
			return integer === n ? n : n.toFixed(2)
		}).join(", ");

	const NotUndefined = (...args) => args
		.filter(a => a !== undefined)
		.shift();
</script>

<Panel>
	<span slot="title">canvas</span>
	<span slot="body">
		<p>pointer: <span class="number">{formatPoint($Pointer)}</span></p>
		<!-- <input type="text" readonly value={formatPoint(NotUndefined($PointerSnap, $Pointer))}> -->
		<div class="center">
			{#if isSnapped}
				<p class="alert">snapped</p>
			{:else}
				<p class="dim">not snapped</p>
			{/if}
		</div>
		<hr />
		<p>zoom: <span class="number">{zoom}</span></p>
		<div class="center">
			<button on:click={CameraMatrix.reset}>reset zoom</button>
		</div>
		<input type="checkbox" bind:checked={$AutoSizeModelMatrix} id="auto-model-matrix"><label for="auto-model-matrix">camera track with changes</label>
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
	/*input[type=text] {
		width: 100%;
	}*/
	.center {
		text-align: center;
		margin: 0.333rem 0;
	}
</style>
