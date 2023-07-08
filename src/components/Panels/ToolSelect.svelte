<script>
	import { elementSelect } from "../../stores/tool.js";
	import {
		SELECT_VERTEX,
		SELECT_EDGE,
		SELECT_FACE,
	} from "../../app/keys.js";
</script>

<div class="container">
	<p>select kind:</p>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectVertices"
			bind:group={$elementSelect}
			value={SELECT_VERTEX} />
		<label for="selectVertices">vertices</label>
	</div>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectEdges"
			bind:group={$elementSelect}
			value={SELECT_EDGE} />
		<label for="selectEdges">edges</label>
	</div>
	<div>
		<input
			type="radio"
			name="VEF"
			id="selectFaces"
			bind:group={$elementSelect}
			value={SELECT_FACE} />
		<label for="selectFaces">faces</label>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	p {
		color: #999;
/*		margin: 1rem 0 0.25rem 0;*/
		font-style: italic;
	}
</style>
