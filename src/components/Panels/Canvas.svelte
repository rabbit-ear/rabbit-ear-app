<script>
	import SelectIcon from "../../tools/select/icon.svelte";
	import SelectSnapIcon from "./icon-pointer-snap.svelte";
	import ZoomIcon from "../../tools/camera/icon.svelte";
	import Panel from "./Panel.svelte";
	import {
		ModelMatrix,
		CameraMatrix,
	} from "../../stores/ViewBox.js";
	import {
		Pointer,
		SnapPoint,
	} from "../../stores/UI.js";

	let zoom;
	$: {
		const value = $CameraMatrix[0] / $ModelMatrix[0];
		zoom = !isNaN(value) ? (1 / value).toFixed(3) : 0;
	};

	let modelSize;
	$: modelSize = $ModelMatrix[0];

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
		{#if $SnapPoint === undefined}
			<div class="flex-row">
				<span class="svg-icon"><SelectIcon /></span>
				<span class="number">{formatPoint($Pointer)}</span>
			</div>
		{:else}
			<div class="flex-row">
				<span class="svg-icon"><SelectSnapIcon /></span>
				<span class="number">{formatPoint($SnapPoint)}</span>
			</div>
		{/if}
		<div class="flex-row">
			<span class="svg-icon"><ZoomIcon /></span>
			<span class="number"><button on:click={CameraMatrix.reset}>1 : {zoom}</button></span>
		</div>
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
		height: 1.75rem;
		width: 1.75rem;
		fill: var(--text);
		stroke: var(--text);
	}
	/*.highlight {
		fill: var(--highlight);
		stroke: var(--highlight);
		color: var(--highlight);
	}*/
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
