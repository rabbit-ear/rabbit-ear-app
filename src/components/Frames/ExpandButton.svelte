<script>
	import { ShowFrames } from "../../stores/App.js";

	let style = "";
	$: style = $ShowFrames
		? "transform: matrix(1, 0, 0, -1, 0, 9);"
		: "transform: matrix(1, 0, 0, 1, 0, 0);"
</script>

	<button
		on:click={() => ShowFrames.update(v => !v)}>
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 9" stroke-width="1.5" stroke-linecap="round">
			<g {style}>
				<line x1="16" y1="2" x2="13" y2="7"/>
				<line x1="20" y1="2" x2="23" y2="7"/>
				<line x1="11" y1="2" x2="8" y2="7"/>
				<line x1="25" y1="2" x2="28" y2="7"/>
				<line x1="6" y1="2" x2="3" y2="7"/>
				<line x1="30" y1="2" x2="33" y2="7"/>
			</g>
		</svg>
	</button>

<style>
	button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: calc(-1.3rem);
		left: 1rem;
		width: 4rem;
		height: 1.3rem;
		cursor: pointer;
		background-color: var(--background-1);
		stroke: var(--dim);
		font-size: 0.9rem;
		font-weight: bold;
	}
	button:hover {
		stroke: var(--text);
	}
	button:focus {
		outline-offset: -2px;
		outline: 2px solid var(--uiblue);
	}
</style>
