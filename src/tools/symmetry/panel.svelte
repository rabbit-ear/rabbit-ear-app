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
	<span slot="title">Symmetry Lines</span>
	<span slot="body">
		<div class="flex-column">
			<!-- <p>{$ReflectionLines.length} currently</p> -->
			{#each $ReflectionLines as line, i}
				<ul class="flex-row between">
					<li>
						<p>{toDegree(line.vector)}&deg;</p>
					</li>
					<button on:click={() => deleteLine(i)}>delete</button>
				</ul>
			{/each}
		</div>
	</span>
</Panel>

<style>
	li {
		margin-left: 1rem;
		list-style: disc;
	}
	.between {
		justify-content: space-between !important;
	}
</style>
