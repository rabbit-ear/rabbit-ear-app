<script>
	import {
		darkMode,
	} from "../stores/app.js";
	import { graph } from "../stores/graph.js";
	import { current } from "../stores/ui.js";

	const clickDarkMode = () => { $darkMode = !$darkMode; };
	const formatPoint = (p) => p
		.map(n => {
			const integer = parseInt(n);
			return integer === n ? n : n.toFixed(4)
		}).join(", ");
</script>

	<nav>
		<ul>
			<li>file
				<ul>
					<li><button on:click={graph.reset}>new</button></li>
					<hr />
					<li><button on:click={() => {}}>open</button></li>
					<li><button on:click={graph.download}>save</button></li>
				</ul>
			</li>
			<li>graph
				<ul>
					<li><button on:click={graph.planarize}>planarize</button></li>
					<li><button on:click={graph.splitSelectedEdges}>split edge</button></li>
					<hr />
					<li><input type="checkbox" id="auto-planarize"><label for="auto-planarize">auto-planarize</label></li>
				</ul>
			</li>
			<li>preferences
				<ul>
					<li highlighted={$darkMode}>
						<button on:click={clickDarkMode}>dark mode</button>
					</li>
				</ul>
			</li>
			<li>
				<input type="text" readonly value={$current ? formatPoint($current) : ""} >
			</li>
		</ul>
	</nav>

<style>
	/*file open hidden input dialog trigger*/
	/*nav input {
		display: none;
	}*/
	/* navbar */
	button {
		all: unset;
		margin: 0;
		padding: 0;
		border: 0;
	}
	nav {
		display: flex;
		flex-direction: row;
		height: 2rem;
		/* font-weight: 700;*/
		box-shadow: 0 0rem 0.5rem 0 #111;
		position: relative;
	}
	nav li {
		padding: 0 1rem;
/*		cursor: pointer;*/
		user-select: none;
		height: 100%;
	}
	nav hr {
		margin: 0.25rem auto;
		width: 90%;
	}
	nav > ul {
		height: 100%;
	}
	nav > ul > li {
		display: inline-flex;
		align-items: center;
	}
	nav ul ul li {
		padding: 0.25rem 1rem;
	}
	nav ul ul {
		display: none;
		position: absolute;
		z-index: 3;
		top: calc(2rem - 3px);
		box-shadow: 0 calc(1rem * 0.5) 1rem 0 black;
	}
	nav ul ul li {
		position: relative;
	}
	nav ul ul ul {
		top: 0;
		left: calc(6rem);
	}
	nav li:hover > ul {
		display: block;
	}

	/* colors*/
	nav,
	nav ul ul {
		background-color: #3a3a3a;
		color: #eee;
	}
	nav li[highlighted=true] {
		background-color: #e53;
		color: white;
	}
	nav li:hover {
		background-color: #444;
		color: white;
	}
	nav li[highlighted=true]:hover {
		background-color: #f75;
	}
</style>
