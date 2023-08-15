<script>
	import NewShape from "./NewShape.svelte";
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import { execute } from "../../kernel/app.js";
	import { DialogNewFile } from "../../stores/App.js";

	const newDidPress = ({ detail }) => {
		switch (detail.shape) {
		case "empty":
			execute("load", {});
			break;
		case "square":
			execute("load", square(detail.size));
			break;
		case "rectangle":
			execute("load", rectangle(detail.width, detail.height));
			break;
		case "regularPolygon":
			execute("load", polygon(detail.sides));
			break;
		}
		$DialogNewFile.close();
	};
</script>

<dialog bind:this={$DialogNewFile}>
	<h1>new file</h1>
	<hr />
	<NewShape on:new={newDidPress} />
</dialog>

<style>
	dialog {
		border: 0;
		background-color: var(--background-1);
	}
	dialog::backdrop {
		background-color: #0004;
/*		background: linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.2));*/
	}
	h1 {
		font-size: 2rem;
	}
</style>
