<script>
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";
import {
	tool,
	selectElement,
} from "../stores/app.js";

</script>

<div class="toolbar">
	<div class="column">
		<input type="radio" name="tool" bind:group={$tool} value={TOOL_SELECT} />
		<label for="select">select</label>
		<input type="radio" name="tool" bind:group={$tool} value={TOOL_VERTEX} />
		<label for="modify">vertex</label>
	</div>

	<hr />

	<div class="column">
		<input type="radio" name="VEF" bind:group={$selectElement} value={SELECT_VERTEX} />
		<label for="vertices">vertices</label>

		<input type="radio" name="VEF" bind:group={$selectElement} value={SELECT_EDGE} />
		<label for="edges">edges</label>

		<input type="radio" name="VEF" bind:group={$selectElement} value={SELECT_FACE} />
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
