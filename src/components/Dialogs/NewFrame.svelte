<script>
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import NewShape from "./NewShape.svelte";
	import { execute } from "../../kernel/app.js";
	import { DialogNewFrame } from "../../stores/App.js";
	import {
		Frames,
		FrameIndex,
	} from "../../stores/Model.js";

	let panel = "";

	const standAloneDidPress = ({ detail }) => {
		switch (detail.shape) {
		case "empty":
			execute("appendFrame", {});
			break;
		case "duplicate":
			execute("appendFrame", structuredClone($Frames[$FrameIndex]));
			break;
		case "square":
			execute("appendFrame", square(detail.size));
			break;
		case "rectangle":
			execute("appendFrame", rectangle(detail.width, detail.height));
			break;
		case "regularPolygon":
			execute("appendFrame", polygon(detail.sides));
			break;
		}
		panel = "";
		$DialogNewFrame.close();
	};

</script>

<dialog bind:this={$DialogNewFrame}>
	<h1>new frame</h1>
	<hr />
	<button on:click={() => panel = "standAlone"}>stand-alone</button>
	<button on:click={() => panel = "child"}>child frame</button>
	<button on:click={() => panel = "tessellation"}>tessellation</button>
	{#if panel==="standAlone"}
		<hr />
		<NewShape on:new={standAloneDidPress}>
			<button on:click={() => standAloneDidPress({ detail: { shape: "duplicate" }})}>duplicate current selection</button>
		</NewShape>
	{/if}
	{#if panel==="child"}
		<hr />
		<button on:click={() => {}}>no modifier</button>
		<button on:click={() => {}}>modifier: folded form</button>
	{/if}
	{#if panel==="tessellation"}
		<hr />
		<button on:click={() => {}}>tessellation</button>
	{/if}
</dialog>

<style>
	dialog {
		border: 0;
		background-color: var(--background-1);
	}
	dialog::backdrop {
		background-color: #0004;
	}
	h1 {
		font-size: 2rem;
	}
</style>
