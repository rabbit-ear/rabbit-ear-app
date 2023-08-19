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

	<p>new crease pattern shape</p>
	<div class="input-row">
		<button on:click={newEmpty}>empty</button>
		<button on:click={newSquare}>square</button>
		<button on:click={() => panel = "nxnSquare"}>NxN square</button>
		<button on:click={() => panel = "rectangle"}>rectangle</button>
		<button on:click={() => panel = "polygon"}>regular polygon</button>
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
	input[type=number] {
		width: 5rem;
	}
	.style-row {
		margin: 0;
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
