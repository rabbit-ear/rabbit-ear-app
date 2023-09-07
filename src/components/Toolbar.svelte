<script>
import ToolSelect from "../tools/select/index.js";
import ToolDelete from "../tools/delete/index.js";
import ToolCamera from "../tools/camera/index.js";
import ToolVertex from "../tools/vertex/index.js";
import ToolEdge from "../tools/edge/index.js";
import ToolAxiom1 from "../tools/axiom1/index.js";
import ToolAxiom2 from "../tools/axiom2/index.js";
import ToolAxiom3 from "../tools/axiom3/index.js";
import ToolAxiom4 from "../tools/axiom4/index.js";
import ToolAxiom5 from "../tools/axiom5/index.js";
import ToolAxiom6 from "../tools/axiom6/index.js";
import ToolAxiom7 from "../tools/axiom7/index.js";
import ToolFoldedLine from "../tools/foldedLine/index.js";
import ToolKawasaki from "../tools/kawasaki/index.js";
import ToolPleat from "../tools/pleat/index.js";
import ToolScribble from "../tools/scribble/index.js";
import ToolSymmetry from "../tools/symmetry/index.js";
// import ToolSplitEdge from "../tools/splitEdge/index.js";
import ToolTranslate from "../tools/translate/index.js";
import ToolScale from "../tools/scale/index.js";
import ToolAssignment from "../tools/assignment/index.js";
import ToolFoldAngle from "../tools/foldAngle/index.js";
import {
	SELECT_VERTEX,
	SELECT_EDGE,
	SELECT_FACE,
} from "../app/keys.js";
import { ToolNew } from "../stores/Tool.js";

// import {
// 	TOOL_SELECT,
// 	TOOL_DELETE,
// 	TOOL_CAMERA,
// 	TOOL_VERTEX,
// 	TOOL_EDGE,
// 	TOOL_AXIOM_1,
// 	TOOL_AXIOM_2,
// 	TOOL_AXIOM_3,
// 	TOOL_AXIOM_4,
// 	TOOL_AXIOM_5,
// 	TOOL_AXIOM_6,
// 	TOOL_AXIOM_7,
// 	TOOL_FOLD_LINE,
// 	TOOL_KAWASAKI,
// 	TOOL_PLEAT,
// 	TOOL_SCRIBBLE,
// 	TOOL_SYMMETRY,
// 	TOOL_SPLIT_EDGE,
// 	TOOL_TRANSLATE,
// 	TOOL_SCALE,
// 	TOOL_ASSIGN,
// 	TOOL_FOLD_ANGLE,
// 	SELECT_VERTEX,
// 	SELECT_EDGE,
// 	SELECT_FACE,
// } from "../app/keys.js";
// import { Tool } from "../stores/Tool.js";
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
		bind:group={$ToolNew}
		value={ToolCamera} />
	<label for="camera">camera</label>
	<input
		type="radio"
		name="tool"
		id="select"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolSelect} />
	<label for="select">select</label>
	<input
		type="radio"
		name="tool"
		id="delete"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolDelete} />
	<label for="delete">delete</label>
</div>

<p>simple</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="vertex"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolVertex} />
	<label for="vertex">vertex</label>
	<input
		type="radio"
		name="tool"
		id="edge"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolEdge} />
	<label for="edge">edge</label>
</div>
 
<p>lines</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="axiom-1"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom1} />
	<label for="axiom-1">axiom 1</label>
	<input
		type="radio"
		name="tool"
		id="axiom-2"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom2} />
	<label for="axiom-2">axiom 2</label>
	<input
		type="radio"
		name="tool"
		id="axiom-3"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom3} />
	<label for="axiom-3">axiom 3</label>
	<input
		type="radio"
		name="tool"
		id="axiom-4"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom4} />
	<label for="axiom-4">axiom 4</label>
	<input
		type="radio"
		name="tool"
		id="axiom-5"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom5} />
	<label for="axiom-5">axiom 5</label>
	<input
		type="radio"
		name="tool"
		id="axiom-6"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom6} />
	<label for="axiom-6">axiom 6</label>
	<input
		type="radio"
		name="tool"
		id="axiom-7"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAxiom7} />
	<label for="axiom-7">axiom 7</label>
</div>

<p>single vertex</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="kawasaki-add"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolKawasaki} />
	<label for="kawasaki-add">kawasaki</label>
</div>

<p>many</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="fold-line"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolFoldedLine} />
	<label for="fold-line">folded line</label>
	<input
		type="radio"
		name="tool"
		id="pleat"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolPleat} />
	<label for="pleat">pleat</label>
	<input
		type="radio"
		name="tool"
		id="scribble"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolScribble} />
	<label for="scribble">scribble</label>
</div>

<!-- 
<p>modifiers</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="split-edge"
		disabled={!editable}
		bind:group={$ToolNew}
		value={TOOL_SPLIT_EDGE} />
	<label for="split-edge">split edge</label>
</div>
 -->

<p>attributes</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="assign"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolAssignment} />
	<label for="assign">assignment</label>
</div>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="fold-angle"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolFoldAngle} />
	<label for="fold-angle">fold angle</label>
</div>

<p>transform</p>
<div class="vertical-radio">
	<input
		type="radio"
		name="tool"
		id="translate"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolTranslate} />
	<label for="translate">translate</label>
	<input
		type="radio"
		name="tool"
		id="scale"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolScale} />
	<label for="scale">scale</label>
	<input
		type="radio"
		name="tool"
		id="symmetry"
		disabled={!editable}
		bind:group={$ToolNew}
		value={ToolSymmetry} />
	<label for="symmetry">symmetry</label>
</div>

<style>
	label {
		user-select: none;
	}
	p {
		color: var(--text);
		margin: 1rem 0 0.25rem 0;
		font-style: italic;
		user-select: none;
	}
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input {
		grid-column: 1;
	}
</style>
