<script>
	import {
		square,
		rectangle,
		polygon,
		fish,
		bird,
	} from "rabbit-ear/fold/bases.js";
	import base1 from "../../assets/base1.fold?raw";
	import base2 from "../../assets/base2.fold?raw";
	import windmill from "../../assets/windmill.fold?raw";
	import Dialog from "./Dialog.svelte";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import FacesLayer from "../SVGCanvas/FacesLayer.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import { executeCommand } from "../../kernel/execute.js";
	import { getFOLDViewport } from "../../js/matrix.js";
	import {
		VerticalUp,
		DialogNewFrame,
	} from "../../stores/App.js";
	import {
		CreasePattern,
		Frames,
	} from "../../stores/Model.js";

	let panel = "";
	let squareSize = 16;
	let rectangleWidth = 2;
	let rectangleHeight = 1;
	let polygonSides = 6;

	const chooseFOLD = (FOLD) => {
		executeCommand("appendFrame", FOLD);
		panel = "";
		$DialogNewFrame.close();
	};

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

	const subpanelConfirm = () => {
		switch (panel) {
			case "nxnSquare": return newFrameDidPress("square");
			case "rectangle": return newFrameDidPress("rectangle");
			case "polygon": return newFrameDidPress("regularPolygon");
			default: return;
		}
	}

	const bases = [
		fish(),
		bird(),
		JSON.parse(base1),
		JSON.parse(windmill),
		JSON.parse(base2),
	];

	const patterns = bases.map(graph => ({
		graph,
		onclick: () => chooseFOLD(graph)
	}));

	$: invertVertical = $VerticalUp;

	$: graphSquare = square();
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
					<button class="svg-button crease-pattern" on:click={duplicate}>
						<SVGCanvas viewBox={graphCurrentFrameViewBox} {invertVertical}>
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
				<button class="svg-button crease-pattern" on:click={newEmpty} />
				<p>empty</p>
			</div>

			<div class="flex-column">
				<button class="svg-button crease-pattern" on:click={newSquare}>
					<SVGCanvas viewBox={graphSquareViewBox} {invertVertical}>
						<FacesLayer graph={graphSquare} />
						<EdgesLayer graph={graphSquare} />
					</SVGCanvas>
				</button>
				<p>square</p>
			</div>

			<div class="flex-column">
				<button class="svg-button crease-pattern" on:click={() => panel = "nxnSquare"}>
					<SVGCanvas viewBox={graphSquareViewBox} {invertVertical}>
						<FacesLayer graph={graphSquare} />
						<EdgesLayer graph={graphSquare} />
					</SVGCanvas>
				</button>
				<p>NxN square</p>
			</div>

			<div class="flex-column">
				<button class="svg-button crease-pattern" on:click={() => panel = "rectangle"}>
					<SVGCanvas viewBox={graphRectangleViewBox} {invertVertical}>
						<FacesLayer graph={graphRectangle} />
						<EdgesLayer graph={graphRectangle} />
					</SVGCanvas>
				</button>
				<p>rectangle</p>
			</div>

			<div class="flex-column">
				<button class="svg-button crease-pattern" on:click={() => panel = "polygon"}>
					<SVGCanvas viewBox={graphPolygonViewBox} {invertVertical}>
						<FacesLayer graph={graphPolygon} />
						<EdgesLayer graph={graphPolygon} />
					</SVGCanvas>
				</button>
				<p>regular polygon</p>
			</div>
		</div>

		<div class="flex-row gap">
			{#each patterns as pattern}
				<div class="flex-column">
					<button class="svg-button crease-pattern" on:click={pattern.onclick}>
						<SVGCanvas
							viewBox={getFOLDViewport(pattern.graph, invertVertical).join(" ")}
							{invertVertical}>
							<FacesLayer graph={pattern.graph} />
							<EdgesLayer graph={pattern.graph} />
						</SVGCanvas>
					</button>
					{#if pattern.name}
						<p>{pattern.name}</p>
					{/if}
				</div>
			{/each}
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
				{/if}
			</div>
		{/if}

		<div class="flex-row gap margin-top">
			<button class="text-button" on:click={() => $DialogNewFrame.close()}>Cancel</button>
			{#if panel !== ""}
				<button class="text-button" on:click={subpanelConfirm}>Confirm</button>
			{/if}

		</div>

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
	.margin-top {
		margin-top: 1rem;
	}
	button.svg-button {
		padding: 0.5rem;
		background-color: var(--background-1);
		width: 6rem;
		height: 6rem;
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
	.svg-button :global(polygon) {
		fill: var(--background-3);
	}
</style>
