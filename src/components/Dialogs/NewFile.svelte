<script>
	import NewShape from "./NewShape.svelte";
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import { executeCommand } from "../../kernel/execute.js";
	import { DialogNewFile } from "../../stores/App.js";

	const newDidPress = ({ detail }) => {
		switch (detail.shape) {
		case "empty":
			executeCommand("load", {});
			break;
		case "square":
			executeCommand("load", square(detail.size));
			break;
		case "rectangle":
			executeCommand("load", rectangle(detail.width, detail.height));
			break;
		case "regularPolygon":
			executeCommand("load", polygon(detail.sides));
			break;
		}
		$DialogNewFile.close();
	};
</script>

<dialog bind:this={$DialogNewFile}>
	<h1>new file</h1>
	<p>This will create a new file and erase all current progress.</p>
	<hr />
	<div>
		<NewShape on:new={newDidPress} />
	</div>
</dialog>

<style>
	dialog {
		border: 0;
		padding: 0;
		background-color: var(--background-1);
		border: 1px solid var(--text);
	}
	dialog::backdrop {
		background-color: #0004;
/*		background: linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.2));*/
	}
	dialog > * {
		margin: 1rem;
	}
	h1 {
		font-size: 2rem;
/*		margin: 0.5rem 0.5rem;*/
	}
</style>
