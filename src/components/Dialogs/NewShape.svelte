<script>
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
</script>

	<button on:click={newEmpty}>empty</button>
	<button on:click={newSquare}>square</button>
	<button on:click={() => panel = "nxnSquare"}>NxN square</button>
	<button on:click={() => panel = "rectangle"}>rectangle</button>
	<button on:click={() => panel = "polygon"}>regular polygon</button>
	<slot />

	<div class="panel">
		{#if panel === "nxnSquare"}
			<label for="square-size">side length</label>
			<input
				type="number"
				placeholder="side length"
				id="square-size"
				bind:value={squareSize}>
			<button on:click={newNxNSquare}>confirm</button>
		{/if}
		{#if panel === "rectangle"}
			<label for="rect-width">width</label>
			<input
				type="number"
				placeholder="width"
				id="rect-width"
				bind:value={rectangleWidth}>
			<label for="rect-height">height</label>
			<input
				type="number"
				placeholder="height"
				id="rect-height"
				bind:value={rectangleHeight}>
			<button on:click={newRectangle}>confirm</button>
		{/if}
		{#if panel === "polygon"}
			<label for="poly-sides">number of sides</label>
			<input
				type="number"
				placeholder="number of sides"
				id="poly-sides"
				bind:value={polygonSides}>
			<button on:click={newRegularPolygon}>confirm</button>
		{/if}
	</div>
