<script>
	import SelectIcon from "../../tools/select/icon.svelte";
	import ZoomIcon from "../../tools/camera/icon.svelte";
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
		<div class="flex-row">
			<span class="svg-icon"><SelectIcon /></span>
			<span class="number">{formatPoint($Pointer)}</span>
		</div>
		<div class="flex-row">
			<span class="svg-icon"><ZoomIcon /></span>
			<span class="number"><button on:click={CameraMatrix.reset}>1 : {zoom}</button></span>
		</div>
		<!-- <input type="text" readonly value={formatPoint(NotUndefined($PointerSnap, $Pointer))}> -->
		<!-- <div class="center">
			{#if isSnapped}
				<p class="alert">snapped</p>
			{:else}
				<p class="dim">not snapped</p>
			{/if}
		</div> -->
		<!-- <input type="checkbox" bind:checked={$AutoSizeModelMatrix} id="auto-model-matrix"><label for="auto-model-matrix">camera track with changes</label> -->
	</span>
</Panel>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.svg-icon {
		display: inline-block;
		height: 2rem;
		width: 2rem;
		fill: var(--text);
		stroke: var(--text);
	}
	.number {
		font-weight: bold;
	}
	button {
		all: unset;
		cursor: pointer;
	}
	button:hover {
		color: var(--highlight);
	}
	/*.alert {
		color: var(--highlight);
	}*/
	/*.dim {
		color: var(--dim);
	}*/
	/*input[type=text] {
		width: 100%;
	}*/
</style>
