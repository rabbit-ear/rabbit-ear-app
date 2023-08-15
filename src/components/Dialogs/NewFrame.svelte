<script>
	import { execute } from "../../kernel/app.js";
	import { DialogNewFrame } from "../../stores/App.js";
	import {
		Frames,
		FrameIndex,
	} from "../../stores/Model.js";

	const newEmpty = () => {
		execute("appendFrame", {});
		$DialogNewFrame.close();
	};

	const duplicate = () => {
		execute("appendFrame", structuredClone($Frames[$FrameIndex]));
		$DialogNewFrame.close();
	};

</script>

<dialog bind:this={$DialogNewFrame}>
	<h1>new frame</h1>
	<hr />
	<h3>stand-alone</h3>
	<button on:click={newEmpty}>empty</button>
	<button on:click={duplicate}>duplicate current selection</button>
	<hr />
	<h3>child frame</h3>
	<button on:click={() => {}}>no modifier</button>
	<button on:click={() => {}}>modifier: folded form</button>
	<hr />
	<h3>parent frame</h3>
	<button on:click={newEmpty}>tessellation</button>
</dialog>

<style>
	dialog {
		border: 0;
		background-color: #333;
	}
	dialog::backdrop {
		background-color: #0004;
	}
	h1 {
		font-size: 2rem;
	}
</style>