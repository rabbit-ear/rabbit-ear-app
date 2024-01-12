<script>
	import {
		FoldedSVGOrWebGL,
		Folded2DIsPossible,
		FoldedStaticOrSimulator,
	} from "../../stores/Renderer.js";

	const viewChange = (view) => {
		switch (view) {
		case "2d":
			$FoldedStaticOrSimulator = false;
			$FoldedSVGOrWebGL = false
			break;
		case "3d":
			$FoldedStaticOrSimulator = false;
			$FoldedSVGOrWebGL = true;
			break;
		case "simulator":
			$FoldedStaticOrSimulator = true;
			break;
		default:
			break;
		}
	};
</script>

<div class="hover-buttons">
	<button
		highlighted={$FoldedStaticOrSimulator === false && !$FoldedSVGOrWebGL}
		disabled={!$Folded2DIsPossible}
		on:click={() => viewChange("2d")}>2D</button>
	<button
		highlighted={$FoldedStaticOrSimulator === false && $FoldedSVGOrWebGL}
		disabled={false}
		on:click={() => viewChange("3d")}>3D</button>
	<button
		highlighted={$FoldedStaticOrSimulator}
		disabled={false}
		on:click={() => viewChange("simulator")}>Sim</button>
</div>

<style>
	.hover-buttons {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		gap: 3px;
		margin: 0.25rem;
	}
	button {
		color: var(--text);
		background-color: var(--background-3);
		padding: 0.2rem 0.4rem;
		border-radius: 0;
		font-weight: normal;
		font-size: 0.8rem;
	}
	button[disabled] {
		color: var(--dim);
	}
	button[highlighted=true] {
		color: var(--bright);
		background-color: var(--uiblue);
	}
</style>
