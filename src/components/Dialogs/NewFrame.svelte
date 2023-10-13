<script>
	import Dialog from "./Dialog.svelte";
	import { DialogNewFrame } from "../../stores/App.js";
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import NewShape from "./NewShape.svelte";
	import { executeCommand } from "../../kernel/execute.js";
	import { getFOLDViewport } from "../../js/matrix.js";
	import { VerticalUp } from "../../stores/App.js";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import FacesLayer from "../SVGCanvas/FacesLayer.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import {
		CreasePattern,
		Frames,
	} from "../../stores/Model.js";

	let panel = "";
	let squareSize = 16;
	let rectangleWidth = 2;
	let rectangleHeight = 1;
	let polygonSides = 6;

	const newFrameDidPress = (shape) => {
		switch (shape) {
		case "empty":
			executeCommand("appendFrame", {});
			break;
		case "duplicate":
			executeCommand("duplicateActiveFrame");
			break;
		case "unit-square":
			executeCommand("appendFrame", square());
			break;
		case "square":
			executeCommand("appendFrame", square(squareSize));
			break;
		case "rectangle":
			executeCommand("appendFrame", rectangle(rectangleWidth, rectangleHeight));
			break;
		case "regularPolygon":
			executeCommand("appendFrame", polygon(polygonSides));
			break;
		}
		panel = "";
		$DialogNewFrame.close();
	};

	const newEmpty = (e) => newFrameDidPress("empty");
	const duplicate = (e) => newFrameDidPress("duplicate");
	const newSquare = (e) => newFrameDidPress("unit-square");
	const newNxNSquare = (e) => newFrameDidPress("square");
	const newRectangle = (e) => newFrameDidPress("rectangle");
	const newRegularPolygon = (e) => newFrameDidPress("regularPolygon");

	$: invertVertical = $VerticalUp;

	$: graphSquare = square(squareSize);
	$: graphSquareViewBox = getFOLDViewport(graphSquare, invertVertical).join(" ");

	$: graphRectangle = rectangle(rectangleWidth, rectangleHeight);
	$: graphRectangleViewBox = getFOLDViewport(graphRectangle, invertVertical).join(" ");

	$: graphPolygon = polygon(polygonSides);
	$: graphPolygonViewBox = getFOLDViewport(graphPolygon, invertVertical).join(" ");

	$: canDuplicate = $Frames.length > 0;

	$: graphCurrentFrame = $CreasePattern ? $CreasePattern : ({});
	$: graphCurrentFrameViewBox = getFOLDViewport(graphCurrentFrame, invertVertical).join(" ");
</script>

<Dialog bind:This={$DialogNewFrame}>
	<h1>New Frame</h1>
	<div>
		{#if canDuplicate}
			<div class="flex-row gap">
				<div class="flex-column">
					<button class="svg-button" on:click={duplicate}>
						<SVGCanvas viewBox={graphCurrentFrameViewBox} {invertVertical} >
							<FacesLayer graph={graphCurrentFrame} />
							<EdgesLayer graph={graphCurrentFrame} />
						</SVGCanvas>
					</button>
					<p>duplicate current frame</p>
				</div>
			</div>
		{/if}

		<div class="flex-row gap">
			<div class="flex-column">
				<button class="svg-button" on:click={newEmpty} />
				<p>empty</p>
			</div>

			<div class="flex-column">
				<button class="svg-button" on:click={newSquare}>
					<SVGCanvas viewBox={graphSquareViewBox} {invertVertical} >
						<FacesLayer graph={graphSquare} />
						<EdgesLayer graph={graphSquare} />
					</SVGCanvas>
				</button>
				<p>square</p>
			</div>

			<div class="flex-column">
				<button class="svg-button" on:click={() => panel = "nxnSquare"}>
					<SVGCanvas viewBox={graphSquareViewBox} {invertVertical} >
						<FacesLayer graph={graphSquare} />
						<EdgesLayer graph={graphSquare} />
					</SVGCanvas>
				</button>
				<p>NxN square</p>
			</div>

			<div class="flex-column">
				<button class="svg-button" on:click={() => panel = "rectangle"}>
					<SVGCanvas viewBox={graphRectangleViewBox} {invertVertical} >
						<FacesLayer graph={graphRectangle} />
						<EdgesLayer graph={graphRectangle} />
					</SVGCanvas>
				</button>
				<p>rectangle</p>
			</div>

			<div class="flex-column">
				<button class="svg-button" on:click={() => panel = "polygon"}>
					<SVGCanvas viewBox={graphPolygonViewBox} {invertVertical} >
						<FacesLayer graph={graphPolygon} />
						<EdgesLayer graph={graphPolygon} />
					</SVGCanvas>
				</button>
				<p>regular polygon</p>
			</div>
		</div>

		{#if panel !== ""}
			<div class="panel">
				<hr />
				{#if panel === "nxnSquare"}
					<div class="flex-row">
						<input
							type="number"
							placeholder="side length"
							id="square-size"
							bind:value={squareSize}>
						<label for="square-size">side length</label>
					</div>
					<div class="confirm-row">
						<button class="text-button" on:click={newNxNSquare}>Confirm</button>
					</div>
				{/if}
				{#if panel === "rectangle"}
					<div class="flex-row">
						<input
							type="number"
							placeholder="width"
							id="rect-width"
							bind:value={rectangleWidth}>
						<input
							type="number"
							placeholder="height"
							id="rect-height"
							bind:value={rectangleHeight}>
						<label for="rect-width">width, </label>
						<label for="rect-height">height</label>
					</div>
					<div class="confirm-row">
						<button class="text-button" on:click={newRectangle}>Confirm</button>
					</div>
				{/if}
				{#if panel === "polygon"}
					<div class="flex-row">
						<input
							type="number"
							placeholder="number of sides"
							id="poly-sides"
							bind:value={polygonSides}>
						<label for="poly-sides">number of sides</label>
					</div>
					<div class="confirm-row">
						<button class="text-button" on:click={newRegularPolygon}>Confirm</button>
					</div>
				{/if}
			</div>
		{/if}

	</div>
</Dialog>

<style>
	h1 {
		text-align: center;
		font-size: 1.5rem;
		margin: 1.5rem;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.gap {
		gap: 0.333rem;
	}
	button.svg-button {
		background-color: var(--background-1);
		width: 6rem;
		height: 6rem;
/*		border: 1px solid var(--background-4);*/
		border: 1px solid var(--dim);
		border-radius: 0.5rem;
	}
	button.svg-button:hover {
		border-color: var(--highlight);
	}
	button.text-button {
		background-color: var(--uiblue);
		color: var(--text);
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border: 0;
		border-radius: 0.5rem;
	}
	input[type=number] {
		width: 5rem;
	}
	p {
		margin: 1rem 0;
	}
	.panel {
		margin: 1rem 0;
	}
	.confirm-row {
		margin: 1rem 0;
		text-align: right;
	}
	.svg-button :global(polygon) {
		fill: var(--background-3);
	}
</style>
