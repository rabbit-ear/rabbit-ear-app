<script>
import {
	TOOL_SELECT,
	TOOL_DELETE,
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
	TOOL_PLEAT,
	TOOL_SCRIBBLE,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../app/keys.js";
import { Tool } from "../stores/Tool.js";
import { FrameIsLocked } from "../stores/Model.js";

let editable = true;
$: editable = !($FrameIsLocked);

</script>

<!-- todo make text non-selectable -->

<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="camera"
		bind:group={$Tool}
		value={TOOL_CAMERA} />
	<label for="camera">camera</label>
	<input
		type="radio"
		name="tool"
		id="select"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_SELECT} />
	<label for="select">select</label>
	<input
		type="radio"
		name="tool"
		id="delete"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_DELETE} />
	<label for="delete">delete</label>
</div>

<p>simple</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="vertex"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_VERTEX} />
	<label for="vertex">vertex</label>
	<input
		type="radio"
		name="tool"
		id="edge"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_EDGE} />
	<label for="edge">edge</label>
</div>
 
<p>lines</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="axiom-1"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_1} />
	<label for="axiom-1">axiom 1</label>
	<input
		type="radio"
		name="tool"
		id="axiom-2"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_2} />
	<label for="axiom-2">axiom 2</label>
	<input
		type="radio"
		name="tool"
		id="axiom-3"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_3} />
	<label for="axiom-3">axiom 3</label>
	<input
		type="radio"
		name="tool"
		id="axiom-4"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_4} />
	<label for="axiom-4">axiom 4</label>
	<input
		type="radio"
		name="tool"
		id="axiom-5"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_5} />
	<label for="axiom-5">axiom 5</label>
	<input
		type="radio"
		name="tool"
		id="axiom-6"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_6} />
	<label for="axiom-6">axiom 6</label>
	<input
		type="radio"
		name="tool"
		id="axiom-7"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_AXIOM_7} />
	<label for="axiom-7">axiom 7</label>
</div>

<p>single vertex</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="kawasaki-add"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_KAWASAKI} />
	<label for="kawasaki-add">kawasaki</label>
</div>

<p>many</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="pleat"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_PLEAT} />
	<label for="pleat">pleat</label>
	<input
		type="radio"
		name="tool"
		id="scribble"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_SCRIBBLE} />
	<label for="scribble">scribble</label>
</div>

<p>modifiers</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="split-edge"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_SPLIT_EDGE} />
	<label for="split-edge">split edge</label>
</div>

<p>attributes</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="assign"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_ASSIGN} />
	<label for="assign">assignment</label>
</div>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="fold-angle"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_FOLD_ANGLE} />
	<label for="fold-angle">fold angle</label>
</div>

<p>transform</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="translate"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_TRANSLATE} />
	<label for="translate">translate</label>
	<input
		type="radio"
		name="tool"
		id="scale"
		disabled={!editable}
		bind:group={$Tool}
		value={TOOL_SCALE} />
	<label for="scale">scale</label>
</div>

<style>
	p {
		color: #999;
		margin: 1rem 0 0.25rem 0;
		font-style: italic;
	}
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input {
		grid-column: 1;
	}
</style>
