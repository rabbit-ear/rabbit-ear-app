<script>
	import SelectIcon from "../../tools/select/icon.svelte";
	import SelectSnapIcon from "./icon-pointer-snap.svelte";
	import FoldedIcon from "./icon-folded.svelte";
	import ZoomIcon from "../../tools/camera/icon.svelte";
	import Panel from "./Panel.svelte";
	import {
		ModelMatrixCP,
		CameraMatrixCP,
		ModelMatrixFolded,
		CameraMatrixFolded,
	} from "../../stores/ViewBox.js";
	import {
		Pointer,
		SnapPoint,
	} from "../../stores/UI.js";
	import {
		ShowStaticOrSimulator,
	} from "../../stores/App.js";

	export let showPanel;

	$: inverseZoomCP = $CameraMatrixCP[0] / $ModelMatrixCP[0];
	$: zoomCP = !isNaN(inverseZoomCP) ? (1 / inverseZoomCP).toFixed(3) : 0;
	$: inverseZoomFolded = $CameraMatrixFolded[0] / $ModelMatrixFolded[0];
	$: zoomFolded = !isNaN(inverseZoomFolded) ? (1 / inverseZoomFolded).toFixed(3) : 0;

	const formatPoint = (p) => p === undefined ? "" : p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(2)
		}).join(", ");

	const NotUndefined = (...args) => args
		.filter(a => a !== undefined)
		.shift();

	const resetZoom = () => {
		CameraMatrixCP.reset();
		CameraMatrixFolded.reset();
	};
</script>

<Panel {showPanel}>
	<span slot="title">Canvas</span>
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
			<span class="number">
				<button class="text-button" on:click={resetZoom}>{zoomCP} / {zoomFolded}</button>
			</span>
		</div>
		<hr />
		<div class="flex-row gap">
			<span class="svg-icon"><FoldedIcon /></span>
			<div class="flex-row toggle-row">
				<button
					highlighted={!$ShowStaticOrSimulator}
					on:click={() => $ShowStaticOrSimulator = false}>static</button>
				<button
					highlighted={$ShowStaticOrSimulator}
					on:click={() => $ShowStaticOrSimulator = true}>simulator</button>
			</div>
		</div>
	</span>
</Panel>

<style>
	.svg-icon {
		display: inline-block;
		height: 1.75rem;
		width: 1.75rem;
		fill: var(--text);
		stroke: var(--text);
	}
	.number {
		font-weight: bold;
	}
	button.text-button {
		all: unset;
		cursor: pointer;
	}
	button.text-button:hover {
		color: var(--highlight);
	}
	button.text-button:focus {
		outline-offset: 2px;
		outline: 2px solid var(--uiblue);
	}
</style>
