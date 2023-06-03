<script>
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
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
		<input type="radio" name="tool" id="select" bind:group={$tool} value={TOOL_SELECT} />
		<label for="select">select</label>
		<input type="radio" name="tool" id="vertex" bind:group={$tool} value={TOOL_VERTEX} />
		<label for="vertex">vertex</label>
		<input type="radio" name="tool" id="edge" bind:group={$tool} value={TOOL_EDGE} />
		<label for="edge">edge</label>
	</div>

	<hr />

	<div class="column">
		<input type="radio" name="VEF" id="selectVertices" bind:group={$selectElement} value={SELECT_VERTEX} />
		<label for="selectVertices">vertices</label>
		<input type="radio" name="VEF" id="selectEdges" bind:group={$selectElement} value={SELECT_EDGE} />
		<label for="selectEdges">edges</label>
		<input type="radio" name="VEF" id="selectFaces" bind:group={$selectElement} value={SELECT_FACE} />
		<label for="selectFaces">faces</label>
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
