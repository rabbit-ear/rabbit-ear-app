<script>
import {
	TOOL_SELECT,
	TOOL_CAMERA,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_AXIOM_1,
	TOOL_AXIOM_2,
	TOOL_AXIOM_3,
	TOOL_AXIOM_4,
	TOOL_AXIOM_5,
	TOOL_AXIOM_6,
	TOOL_AXIOM_7,
	TOOL_KAWASAKI,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../app/keys.js";
import {
	tool,
	elementSelect,
} from "../stores/tool.js";
import { graph } from "../stores/graph.js";

let tempCreateLineType;

const CREATE_LINE_SELECTED_FACES = "createOneFace";
const CREATE_LINE_ALL_FACES = "createAllFaces";
const CREATE_LINE_RULER = "createRuler";

</script>

<!-- todo make text non selectable -->

<div class="toolbar">

	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="select"
			bind:group={$tool}
			value={TOOL_CAMERA} />
		<label for="select">camera</label>
		<input
			type="radio"
			name="tool"
			id="select"
			bind:group={$tool}
			value={TOOL_SELECT} />
		<label for="select">select</label>
	</div>
 
	<p>create</p>
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

	<p>line</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="axiom-1"
			bind:group={$tool}
			value={TOOL_AXIOM_1} />
		<label for="axiom-1">axiom 1</label>
		<input
			type="radio"
			name="tool"
			id="axiom-2"
			bind:group={$tool}
			value={TOOL_AXIOM_2} />
		<label for="axiom-2">axiom 2</label>
		<input
			type="radio"
			name="tool"
			id="axiom-3"
			bind:group={$tool}
			value={TOOL_AXIOM_3} />
		<label for="axiom-3">axiom 3</label>
		<input
			type="radio"
			name="tool"
			id="axiom-4"
			bind:group={$tool}
			value={TOOL_AXIOM_4} />
		<label for="axiom-4">axiom 4</label>
		<input
			type="radio"
			name="tool"
			id="axiom-5"
			bind:group={$tool}
			value={TOOL_AXIOM_5} />
		<label for="axiom-5">axiom 5</label>
		<input
			type="radio"
			name="tool"
			id="axiom-6"
			bind:group={$tool}
			value={TOOL_AXIOM_6} />
		<label for="axiom-6">axiom 6</label>
		<input
			type="radio"
			name="tool"
			id="axiom-7"
			bind:group={$tool}
			value={TOOL_AXIOM_7} />
		<label for="axiom-7">axiom 7</label>
	</div>

	<p>ray</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="kawasaki"
			bind:group={$tool}
			value={TOOL_KAWASAKI} />
		<label for="kawasaki">kawasaki</label>
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

	<p>attributes</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="assign"
			bind:group={$tool}
			value={TOOL_ASSIGN} />
		<label for="assign">assignment</label>
	</div>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="fold-angle"
			bind:group={$tool}
			value={TOOL_FOLD_ANGLE} />
		<label for="fold-angle">fold angle</label>
	</div>

	<p>transform</p>
	<div class="vertical-radio">
		<input
			type="radio"
			name="tool"
			id="translate"
			bind:group={$tool}
			value={TOOL_TRANSLATE} />
		<label for="translate">translate</label>
		<input
			type="radio"
			name="tool"
			id="scale"
			bind:group={$tool}
			value={TOOL_SCALE} />
		<label for="scale">scale</label>
	</div>

	<hr />

	<p>lines into:</p>

	<div class="vertical-radio">
		<input
			disabled=true
			type="radio"
			name="create-type"
			id="create-line-selected-faces"
			bind:group={tempCreateLineType}
			value={CREATE_LINE_SELECTED_FACES} />
		<label for="create-line-selected-faces">graph segments</label>
		<input
			disabled=true
			type="radio"
			name="create-type"
			id="create-line-ruler"
			bind:group={tempCreateLineType}
			value={CREATE_LINE_RULER} />
		<label for="create-line-ruler">ruler lines</label>
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
		overflow-y: auto;
	}
	.toolbar {
		padding-top: 0.5rem;
	}
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input {
		grid-column: 1;
	}
</style>
