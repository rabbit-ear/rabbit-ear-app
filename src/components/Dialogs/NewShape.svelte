<script>
	import { boundingBox } from "rabbit-ear/graph/boundary.js";
	import { boundingBoxToViewBox } from "rabbit-ear/convert/foldToSvg/general.js";
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import SVGCanvas from "../SVGCanvas/SVGCanvas.svelte";
	import FacesLayer from "../SVGCanvas/FacesLayer.svelte";
	import EdgesLayer from "../SVGCanvas/EdgesLayer.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const confirmed = (detail) => {
		panel = "";
		dispatch("new", detail);
	};

	const newEmpty = (e) => confirmed({
		shape: "empty",
	});
	const newSquare = (e) => confirmed({
		shape: "square", size: 1,
	});
	const newNxNSquare = (e) => confirmed({
		shape: "square", size: squareSize,
	});
	const newRectangle = (e) => confirmed({
		shape: "rectangle", width: rectangleWidth, height: rectangleHeight,
	});
	const newRegularPolygon = (e) => confirmed({
		shape: "regularPolygon", sides: polygonSides,
	});

	let panel = "";
	let squareSize = 16;
	let rectangleWidth = 2;
	let rectangleHeight = 1;
	let polygonSides = 6;

	$: graphSquare = square(squareSize);
	$: graphSquareViewBox = boundingBoxToViewBox(boundingBox(graphSquare))
		.split(" ")
		.map(n => parseInt(n, 10));

	$: graphRectangle = rectangle(rectangleWidth, rectangleHeight);
	$: graphRectangleViewBox = boundingBoxToViewBox(boundingBox(graphRectangle))
		.split(" ")
		.map(n => parseInt(n, 10));

	$: graphPolygon = polygon(polygonSides);
	$: graphPolygonViewBox = boundingBoxToViewBox(boundingBox(graphPolygon))
		.split(" ")
		.map(n => parseFloat(n));
</script>

	<p>new crease pattern shape</p>
	<div class="input-row">
		<button class="svg-button" on:click={newEmpty}>
			<SVGCanvas />
		</button>

		<button class="svg-button" on:click={newSquare}>
			<SVGCanvas viewBox={graphSquareViewBox} >
				<FacesLayer graph={graphSquare} />
				<EdgesLayer graph={graphSquare} />
			</SVGCanvas>
		</button>

		<button class="svg-button" on:click={() => panel = "nxnSquare"}>
			<SVGCanvas viewBox={graphSquareViewBox} >
				<FacesLayer graph={graphSquare} />
				<EdgesLayer graph={graphSquare} />
			</SVGCanvas>
		</button>

		<button class="svg-button" on:click={() => panel = "rectangle"}>
			<SVGCanvas viewBox={graphRectangleViewBox} >
				<FacesLayer graph={graphRectangle} />
				<EdgesLayer graph={graphRectangle} />
			</SVGCanvas>
		</button>

		<button class="svg-button" on:click={() => panel = "polygon"}>
			<SVGCanvas viewBox={graphPolygonViewBox} >
				<FacesLayer graph={graphPolygon} />
				<EdgesLayer graph={graphPolygon} />
			</SVGCanvas>
		</button>
	</div>
	<slot />

	{#if panel !== ""}
		<div class="panel">
			<hr />
			{#if panel === "nxnSquare"}
				<p>square dimensions</p>
				<div class="input-row">
					<input
						type="number"
						placeholder="side length"
						id="square-size"
						bind:value={squareSize}>
					<label for="square-size">side length</label>
				</div>
				<div class="confirm-row">
					<button on:click={newNxNSquare}>confirm</button>
				</div>
			{/if}
			{#if panel === "rectangle"}
				<p>rectangle dimensions</p>
				<div class="input-row">
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
					<button on:click={newRectangle}>confirm</button>
				</div>
			{/if}
			{#if panel === "polygon"}
				<p>regular polygon</p>
				<div class="input-row">
					<input
						type="number"
						placeholder="number of sides"
						id="poly-sides"
						bind:value={polygonSides}>
					<label for="poly-sides">number of sides</label>
				</div>
				<div class="confirm-row">
					<button on:click={newRegularPolygon}>confirm</button>
				</div>
			{/if}
		</div>
	{/if}

<style>
	button.svg-button {
		background-color: var(--background-1);
		width: 6rem;
		height: 6rem;
		border: 2px solid var(--background-4);
		border-radius: 0.5rem;
	}
	button.svg-button:hover {
		border: 2px solid var(--dim);
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
	.input-row {
		text-align: center;
	}
	.confirm-row {
		margin: 1rem 0;
		text-align: right;
	}
</style>
