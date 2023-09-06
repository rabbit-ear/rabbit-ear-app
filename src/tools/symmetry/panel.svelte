<script>
	// import {
	// 	RulerLines,
	// 	RulerRays,
	// } from "../../stores/Ruler.js";
	import { SymmetryLines } from "../../stores/Symmetry.js";

	const toDegree = (vector) => {
		const radians = Math.atan2(vector[1], vector[0]);
		return (radians * 180 / Math.PI).toFixed(1);
	};
	const deleteLine = (index) => SymmetryLines.update(lines => {
		lines.splice(index, 1);
		return lines;
	});
</script>

<p>{$SymmetryLines.length} currently</p>

{#each $SymmetryLines as line, i}
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
<div>
	<button on:click={() => {}}>clear all lines</button>
</div>

<style>
	li { margin-left: 1rem; }
	li {
		list-style: disc;
/*		list-style-type: circle;*/
	}
	button {
/*		all: unset;*/
	}
	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>