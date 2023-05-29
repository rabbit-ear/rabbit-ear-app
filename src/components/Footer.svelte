<script>
	import { onKeyDown } from "../stores/ui.js";

	let textareaValue = "";

	export const keydown = (e) => {
		e.preventDefault();
		onKeyDown(e);
		switch (e.keyCode) {
		case 13: textareaValue = ""; break;
		default: break;
		}
	};
</script>

<div>
	<textarea
		bind:value={textareaValue}
		autocomplete="off"
		autocorrect="off"
		rows="1"
	/>
</div>

<style>
	div {
		height: 2rem;
		display: flex;
		flex-direction: column;
	}
	textarea {
		height: 100%;
		resize: none;
		border: 1px solid transparent;
		color: #ddd;
		outline-color: transparent;
		background-color: #333;
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid #17c;
		outline-color: transparent;
		background-color: #222;
	}
</style>
