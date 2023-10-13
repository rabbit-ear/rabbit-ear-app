<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import {
		UndoStack,
		RedoStack,
		UndoHistoryLength,
	} from "./stores.js";

	let showPanel = false;
</script>

<Panel {showPanel}>
	<span slot="title">Undo History</span>
	<span slot="body">
		<div class="flex-column gap">
			<p>undo: <span class="number">{$UndoStack.length}</span></p>
			<p>redo: <span class="number">{$RedoStack.length}</span></p>
			<p>max: <span class="number">{$UndoHistoryLength}</span></p>
		</div>
	</span>
</Panel>

<style>
	.number { font-weight: bold; }
</style>
