<script>
	import {
		square,
		rectangle,
		polygon,
		fish,
		frog,
		bird,
		base1,
		windmill,
	} from "rabbit-ear/fold/bases.js";
	import populate from "rabbit-ear/graph/populate.js";
	import base2 from "../../assets/base2.fold?raw";
	// import windmill from "../../assets/windmill.fold?raw";
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
	import { Frames } from "../../stores/Model.js";
	import { CreasePattern } from "../../stores/ModelCP.js";

	let panel = "";
	let squareSize = 16;
	let rectangleWidth = 2;
	let rectangleHeight = 1;
	let polygonSides = 6;

	$: invertVertical = $VerticalUp;
	$: canDuplicate = $Frames.length > 0;
	$: graphSquare = square();
	$: graphRectangle = rectangle(rectangleWidth, rectangleHeight);
	$: graphPolygon = polygon(polygonSides);
	$: graphCurrentFrame = $CreasePattern ? $CreasePattern : ({});
	$: graphCurrentFrameViewport = getFOLDViewport(graphCurrentFrame, invertVertical);
	$: graphCurrentFrameViewBox = graphCurrentFrameViewport.join(" ");
	$: currentFrameStrokeWidth = graphCurrentFrameViewport
		? 0.01 * Math.max(graphCurrentFrameViewport[2], graphCurrentFrameViewport[3])
		: 0.01;

	// todo: maybe we can include strokeWidth calculation in the
	// crease pattern buttons. will be safer in the future.

	const chooseFOLD = (FOLD) => {
		executeCommand("appendFrame", FOLD);
		panel = "";
		$DialogNewFrame.close();
	};

	const duplicate = () => {
		executeCommand("duplicateActiveFrame");
		panel = "";
		$DialogNewFrame.close();
	};			

	let patternsRow1 = [];
	$: patternsRow1 = [
		[{}, "empty", () => chooseFOLD({})],
		[graphSquare, "square", () => chooseFOLD(square())],
		[graphSquare, "NxN square", () => panel = "nxnSquare"],
		[graphRectangle, "rectangle", () => panel = "rectangle"],
		[graphPolygon, "regular polygon", () => panel = "polygon"],
	].map(([graph, name, onclick]) => ({ graph, name, onclick }));

	const patternsRow2 = [
		fish(),
		bird(),
		base1(),
		frog(),
		// JSON.parse(windmill),
		windmill(),
		populate(JSON.parse(base2)),
	].map(graph => ({ graph, onclick: () => chooseFOLD(graph) }));

	const subpanelConfirm = () => {
		switch (panel) {
			case "nxnSquare":
				return chooseFOLD(square(squareSize));
			case "rectangle":
				return chooseFOLD(rectangle(rectangleWidth, rectangleHeight));
			case "polygon":
				return chooseFOLD(polygon(polygonSides));
			default: break;
		}
	};
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
							<EdgesLayer
								graph={graphCurrentFrame}
								strokeWidth={currentFrameStrokeWidth} />
						</SVGCanvas>
					</button>
					<p>duplicate current frame</p>
				</div>
			</div>
		{/if}

		<div class="flex-row gap">
			{#each patternsRow1 as pattern}
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

		<div class="flex-row gap">
			{#each patternsRow2 as pattern}
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
