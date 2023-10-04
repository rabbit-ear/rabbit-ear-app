<script>
	import SelectIcon from "../../tools/select/icon.svelte";
	import SelectSnapIcon from "./icon-pointer-snap.svelte";
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
			<span class="number"><button on:click={resetZoom}>{zoomCP} / {zoomFolded}</button></span>
		</div>
		<hr />
		<div class="flex-column gap">
			<p>folded state</p>
			<div>
				<input
					type="radio"
					id="radio-folded-static"
					bind:group={$ShowStaticOrSimulator}
					value={false} />
				<label for="radio-folded-static">static</label>
			</div>
			<div>
				<input
					type="radio"
					id="radio-folded-simulator"
					bind:group={$ShowStaticOrSimulator}
					value={true} />
				<label for="radio-folded-simulator">simulator</label>
			</div>
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
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	.gap {
		gap: 0.333rem;
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
