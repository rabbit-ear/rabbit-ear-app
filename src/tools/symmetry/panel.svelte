<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { ReflectionLines } from "./stores.js";

	export let showPanel;

	const toDegree = (vector) => {
		const radians = Math.atan2(vector[1], vector[0]);
		return (radians * 180 / Math.PI).toFixed(1);
	};
	const deleteLine = (index) => ReflectionLines.update(lines => {
		lines.splice(index, 1);
		return lines;
	});
</script>

<Panel {showPanel}>
	<span slot="title">Symmetry</span>
	<span slot="body">
		<div class="container">
			<p>{$ReflectionLines.length} currently</p>

			{#each $ReflectionLines as line, i}
				<ul class="row">
					<div>
						<!-- <input type="checkbox" checked>
						<p>{toDegree(line.vector)}&deg;</p> -->
						<li>
							<p>{toDegree(line.vector)}&deg;</p>
						</li>

					</div>
					<div>
						<button on:click={() => deleteLine(i)}>delete</button>
					</div>
				</ul>
			{/each}
			<!-- <div>
				<button on:click={() => {}}>clear all lines</button>
			</div> -->
		</div>
	</span>
</Panel>

<style>
	li { margin-left: 1rem; }
	li {
		list-style: disc;
/*		list-style-type: circle;*/
	}
	button {
/*		all: unset;*/
	}
	.container {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
