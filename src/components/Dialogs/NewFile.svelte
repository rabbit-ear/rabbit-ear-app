<script>
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import { execute } from "../../kernel/app.js";
	import { DialogNewFile } from "../../stores/App.js";

	let detail = "";
	let squareSize = 16;
	let polygonSides = 6;
	let rectangleWidth = 2;
	let rectangleHeight = 1;

	const newEmpty = () => {
		detail = "";
		execute("load", {});
		$DialogNewFile.close();
	};
	const newSquare = () => {
		detail = "";
		execute("load", square());
		$DialogNewFile.close();
	};
	const newNxNSquare = () => { detail = "nxnSquare"; }
	const newRectangle = () => { detail = "rectangle"; };
	const newPolygon = () => { detail = "polygon"; };
	const newNxNSquareConfirm = () => {
		execute("load", square(squareSize));
		$DialogNewFile.close();
	}
	const newRectangleConfirm = () => {
		execute("load", rectangle(rectangleWidth, rectangleHeight));
		$DialogNewFile.close();
	}
	const newPolygonConfirm = () => {
		execute("load", polygon(polygonSides));
		$DialogNewFile.close();
	}
</script>

<dialog bind:this={$DialogNewFile}>
	<h1>new file</h1>
	<hr />
	<button on:click={newEmpty}>empty</button>
	<button on:click={newSquare}>square</button>
	<button on:click={newNxNSquare}>NxN square</button>
	<button on:click={newRectangle}>rectangle</button>
	<button on:click={newPolygon}>regular polygon</button>
	{#if detail === "nxnSquare"}
		<div class="detail">
			<label for="square-size">side length</label>
			<input
				type="number"
				placeholder="side length"
				id="square-size"
				bind:value={squareSize}>
			<button on:click={newNxNSquareConfirm}>confirm</button>
		</div>
	{/if}
	{#if detail === "rectangle"}
		<div class="detail">
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
			<button on:click={newRectangleConfirm}>confirm</button>
		</div>
	{/if}
	{#if detail === "polygon"}
		<div class="detail">
			<label for="poly-sides">number of sides</label>
			<input
				type="number"
				placeholder="number of sides"
				id="poly-sides"
				bind:value={polygonSides}>
			<button on:click={newPolygonConfirm}>confirm</button>
		</div>
	{/if}
</dialog>

<style>
	dialog {
		border: 0;
		background-color: #333;
	}
	dialog::backdrop {
		background-color: #0004;
/*		background: linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.2));*/
	}
	h1 {
		font-size: 2rem;
	}
</style>