<script>
	import {
		square,
		rectangle,
		polygon,
	} from "rabbit-ear/fold/bases.js";
	import NewShape from "./NewShape.svelte";
	import { executeCommand } from "../../kernel/execute.js";
	import { DialogNewFrame } from "../../stores/App.js";
	import {
		Frames,
		FrameIndex,
	} from "../../stores/Model.js";

	let panel = "standAlone";

	const standAloneDidPress = ({ detail }) => {
		switch (detail.shape) {
		case "empty":
			executeCommand("appendFrame", {});
			break;
		case "duplicate":
			executeCommand("appendFrame", structuredClone($Frames[$FrameIndex]));
			break;
		case "square":
			executeCommand("appendFrame", square(detail.size));
			break;
		case "rectangle":
			executeCommand("appendFrame", rectangle(detail.width, detail.height));
			break;
		case "regularPolygon":
			executeCommand("appendFrame", polygon(detail.sides));
			break;
		}
		panel = "standAlone";
		$DialogNewFrame.close();
	};
</script>

<dialog bind:this={$DialogNewFrame}>
	<h1>new frame</h1>
	<p>This will append a new frame to your current file.</p>
	<div class="input-row">
		<input type="radio" name="panelSelect" id="panelSelectStandAlone" bind:group={panel} value={"standAlone"}><label for="panelSelectStandAlone">stand-alone</label>
		<input type="radio" name="panelSelect" id="panelSelectChild" bind:group={panel} value={"child"}><label for="panelSelectChild">child</label>
		<input type="radio" name="panelSelect" id="panelSelectTessellation" bind:group={panel} value={"tessellation"}><label for="panelSelectTessellation">tessellation</label>
		<!-- <button on:click={() => panel = "standAlone"}>stand-alone</button>
		<button on:click={() => panel = "child"}>child frame</button>
		<button on:click={() => panel = "tessellation"}>tessellation</button> -->
	</div>
	{#if panel==="standAlone"}
		<hr />
		<div>
			<h3>stand-alone frame</h3>
			<NewShape on:new={standAloneDidPress}>
				<button on:click={() => standAloneDidPress({ detail: { shape: "duplicate" }})}>duplicate selected frame</button>
			</NewShape>
		</div>
	{/if}
	{#if panel==="child"}
		<hr />
		<div class="input-row">
			<button on:click={() => {}}>no modifier</button>
			<button on:click={() => {}}>modifier: folded form</button>
		</div>
	{/if}
	{#if panel==="tessellation"}
		<hr />
		<div class="input-row">
			<button on:click={() => {}}>tessellation</button>
		</div>
	{/if}
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
	}
	dialog > * {
		margin: 1rem;
	}
	h1 {
		font-size: 2rem;
	}
	.input-row {
		text-align: center;
	}
</style>
