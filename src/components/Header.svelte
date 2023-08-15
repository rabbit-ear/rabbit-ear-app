<script>
	import { assignmentCanBeFolded } from "rabbit-ear/fold/spec.js";
	import { get } from "svelte/store";
	import {
		// DarkMode,
		AutoPlanarize,
		Snapping,
	} from "../stores/App.js";
	import { Graph } from "../stores/Model.js";
	import { execute } from "../kernel/app.js";
	import { loadFileDialog } from "../js/file.js";
	import {
		ShowSimulator,
		ShowTerminal,
		ShowFlatFoldableIssues,
		DialogNewFile,
	} from "../stores/App.js";

	let inputFile;
	// const clickDarkMode = () => { $DarkMode = !$DarkMode; };
	const selectAll = () => execute("selectAll");
	const deselectAll = () => execute("clearSelection");
	const findBoundary = () => execute("findBoundary");
	const invertAssignments = () => {
		const graph = get(Graph);
		const edges_assignment = graph.edges_assignment || [];
		const edges = (graph.edges_vertices || [])
			.map((_, i) => i)
			.filter(e => assignmentCanBeFolded[graph.edges_assignment[e]])
		execute("toggleAssignment", edges);
	};
</script>

	<nav>
		<ul>
			<li>file
				<ul>
					<li><button on:click={() => $DialogNewFile.showModal()}>new</button></li>
					<hr />
					<li><button on:click={() => inputFile.click()}>load</button></li>
					<li>
						<button on:click={() => execute("download", "origami.fold")}>save</button>
					</li>
				</ul>
			</li>
			<li>graph
				<ul>
					<li>
						<span class="popover">convert to planar graph</span>
						<button on:click={() => execute("planarize")}>planarize</button>
					</li>
					<li class="no-select">
						<span class="popover">automatically planarize after (most) operations</span>
						<input type="checkbox" id="checkbox-auto-planarize" bind:checked={$AutoPlanarize}>
						<label for="checkbox-auto-planarize">auto-planarize</label>
					</li>
					<hr />
					<li disabled>insert
						<!-- <ul>
							<li><button on:click={() => {}}>fish</button></li>
							<li><button on:click={() => {}}>windmill</button></li>
							<li><button on:click={() => {}}>bird</button></li>
							<li><button on:click={() => {}}>frog</button></li>
						</ul> -->
					</li>
					<hr />
					<li class="no-select description">grid snapping</li>
					<li class="no-select">
						<div>
							<input
								type="radio"
								id="radio-snapping-grid"
								bind:group={$Snapping}
								value={true}
							>
							<label for="radio-snapping-grid">on</label>
						</div>
						<div>
							<input
								type="radio"
								id="radio-snapping-no-snapping"
								bind:group={$Snapping}
								value={false}
							>
							<label for="radio-snapping-no-snapping">off</label>
						</div>
					</li>
					<li>
						<button on:click={() => execute("snapAllVertices")}>snap once to grid</button>
					</li>
				</ul>
			</li>
			<li>assignment
				<ul>
					<li><button on:click={findBoundary}>rebuild boundary</button></li>
					<li><button on:click={invertAssignments}>invert assignments</button></li>
					<li disabled>reassign selected
						<!-- <ul>
							<li><button on:click={() => {}}>boundary</button></li>
							<li><button on:click={() => {}}>mountain</button></li>
							<li><button on:click={() => {}}>valley</button></li>
							<li><button on:click={() => {}}>flat</button></li>
							<li><button on:click={() => {}}>cut</button></li>
							<li><button on:click={() => {}}>join</button></li>
							<li><button on:click={() => {}}>unassigned</button></li>
						</ul> -->
					</li>
					<li><button on:click={() => {}}>flatten 3D angles</button></li>
				</ul>
			</li>
			<li>select
				<ul>
					<li><button on:click={selectAll}>select all</button></li>
					<li><button on:click={deselectAll}>deselect all</button></li>
					<li>select by assignment
						<ul>
							<li><button on:click={() => {}}>boundary</button></li>
							<li><button on:click={() => {}}>mountain</button></li>
							<li><button on:click={() => {}}>valley</button></li>
							<li><button on:click={() => {}}>flat</button></li>
							<li><button on:click={() => {}}>cut</button></li>
							<li><button on:click={() => {}}>join</button></li>
							<li><button on:click={() => {}}>unassigned</button></li>
						</ul>
					</li>
					<li><button on:click={() => {}}>select 3D angles</button></li>
					<hr />
					<li class="no-select description">select type:</li>
					<li class="no-select">
						<input type="radio" id="radio-select-vertex">
						<label for="radio-select-vertex">vertex</label>
						<input type="radio" id="radio-select-edge">
						<label for="radio-select-edge">edge</label>
						<input type="radio" id="radio-select-face">
						<label for="radio-select-face">face</label>
					</li>
					<hr />
					<li class="no-select description">modify selection</li>
					<li><button on:click={() => {}}>merge selected vertices</button></li>
					<li>set edges fold angle</li>
					<li>set edges assignment</li>
				</ul>
			</li>
			<li>analysis
				<ul>
					<li>
						<input type="checkbox" id="checkbox-flat-foldable" bind:checked={$ShowFlatFoldableIssues}>
						<label for="checkbox-flat-foldable">flat-foldable issues</label>
					</li>
					<!-- <li>show face-winding</li> -->
					<!-- <li>isolated vertices</li> -->
					<li class="no-select description">show indices</li>
					<li class="no-select">
						<input type="checkbox" id="checkbox-vertices-indices">
						<label for="checkbox-vertices-indices">vertices</label>
					</li>
					<li class="no-select">
						<input type="checkbox" id="checkbox-edges-indices">
						<label for="checkbox-edges-indices">edges</label>
					</li>
					<li class="no-select">
						<input type="checkbox" id="checkbox-faces-indices">
						<label for="checkbox-faces-indices">faces</label>
					</li>
				</ul>
			</li>
			<li>solvers
				<ul>
					<li class="no-select description">crease pattern</li>
					<li>flat-foldable vertex</li>
					<li class="no-select description">simulator</li>
					<li>find fold angles</li>
				</ul>
			</li>
			<li>window
				<ul>
					<li class="no-select">
						<input type="checkbox" id="checkbox-show-simulator" bind:checked={$ShowSimulator}>
						<label for="checkbox-show-simulator">show simulator</label>
					</li>
					<li class="no-select">
						<input type="checkbox" id="checkbox-show-terminal" bind:checked={$ShowTerminal}>
						<label for="checkbox-show-terminal">show terminal</label>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
	<input
		type="file"
		id="file"
		bind:this={inputFile}
		on:change={loadFileDialog} />

<style>
	nav {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		box-shadow: 0 0rem 0.5rem 0 black;
		position: relative;
	}
	nav > ul > li {
		font-weight: bold;
	}
	nav > ul > li > ul {
		font-weight: normal;
	}
	li[disabled] { opacity: 0.5; }
	nav li {
		padding: 0 1rem;
		user-select: none;
		height: 100%;
		/* cursor: pointer;*/
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
		left: calc(3rem);
	}
	nav li:hover > ul {
		display: block;
	}

	/* colors*/
	nav,
	nav ul ul {
		background-color: var(--background-2);
		color: var(--text);
	}
	/*nav li[highlighted=true] {
		background-color: #e53;
		color: var(--highlight);
	}*/
	nav li:hover {
		background-color: var(--background-3);
		color: var(--bright);
	}
	/*nav li[highlighted=true]:hover {
		background-color: #f75;
	}*/
	nav li.no-select {
		background-color: unset;
		color: unset;
	}
	nav li.no-select:hover {
		background-color: unset;
	}
	nav li.description {
		font-style: italic;
		opacity: 80%;
	}
	label {
		user-select: none;
	}
	.popover {
		display: none;
	}
	input[type=file] {
		display: none;
		/* visibility: hidden; */
	}
	button {
		all: unset;
		margin: 0;
		padding: 0;
		border: 0;
	}
</style>
