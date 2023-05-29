<script>
import {
	tool,
	selectElement,
} from "../stores/app.js";

</script>

<div class="toolbar">
	<div class="column">
		<input type="radio" name="tool" bind:group={$tool} value={"select"} />
		<label for="select">select</label>
		<input type="radio" name="tool" bind:group={$tool} value={"newVertex"} />
		<label for="modify">new vertex</label>
	</div>

	<hr />

	<div class="column">
		<input type="radio" name="VEF" bind:group={$selectElement} value="vertex" />
		<label for="vertices">vertices</label>

		<input type="radio" name="VEF" bind:group={$selectElement} value="edge" />
		<label for="edges">edges</label>

		<input type="radio" name="VEF" bind:group={$selectElement} value="face" />
		<label for="faces">faces</label>
	</div>
</div>

<style>
	.toolbar {
		flex: 0 1 8rem;
		background-color: #333;
	}
	.column {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
</style>
