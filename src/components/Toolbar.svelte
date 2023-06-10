<script>
import {
	TOOL_SELECT,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_SPLIT_EDGE,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../js/enums.js";
import {
	tool,
	elementSelect,
} from "../stores/app.js";
import { graph } from "../stores/graph.js";

</script>

<div class="toolbar">
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="select"
			bind:group={$tool}
			value={TOOL_SELECT} />
		<label for="select">select</label>
	</div>
	<p>tool</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="vertex"
			bind:group={$tool}
			value={TOOL_VERTEX} />
		<label for="vertex">vertex</label>
		<input
			type="radio"
			name="tool"
			id="edge"
			bind:group={$tool}
			value={TOOL_EDGE} />
		<label for="edge">edge</label>
	</div>
	<p>modifiers</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="split-edge"
			bind:group={$tool}
			value={TOOL_SPLIT_EDGE} />
		<label for="split-edge">split edge</label>
	</div>

	<hr />

	<div class="horizontal-radio">
		<input
			type="radio"
			name="VEF"
			id="selectVertices"
			bind:group={$elementSelect}
			value={SELECT_VERTEX}
			disabled={$tool !== TOOL_SELECT} />
		<label for="selectVertices">V</label>
		<input
			type="radio"
			name="VEF"
			id="selectEdges"
			bind:group={$elementSelect}
			value={SELECT_EDGE}
			disabled={$tool !== TOOL_SELECT} />
		<label for="selectEdges">E</label>
		<input
			type="radio"
			name="VEF"
			id="selectFaces"
			bind:group={$elementSelect}
			value={SELECT_FACE}
			disabled={$tool !== TOOL_SELECT} />
		<label for="selectFaces">F</label>
	</div>

	<hr />

</div>

<style>
	p {
		color: #999;
		margin: 1rem 0 0.25rem 0;
		font-style: italic;
	}
	.toolbar {
		flex: 0 1 8rem;
		background-color: #333;
	}
	.toolbar { padding-top: 0.5rem; }
	.column {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input { grid-column: 1; }
	.horizontal-radio {
		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: repeat(3, 1fr);
	}
	.horizontal-radio input { grid-row: 1; }
	.horizontal-radio label { margin: auto; }
</style>
