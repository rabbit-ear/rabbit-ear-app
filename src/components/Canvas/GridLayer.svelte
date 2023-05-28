<script>
	import { viewBox } from "../../stores/app.js";
</script>

<g class="grid" stroke-width={Math.max($viewBox[2], $viewBox[3]) / 400}>
	{#each Array.from(Array($viewBox[2] + 1)).map((_, i) => i + $viewBox[0]) as x}
		<line x1={x} y1={$viewBox[1]} x2={x} y2={$viewBox[1] + $viewBox[3]} />
	{/each}
	{#each Array.from(Array($viewBox[3] + 1)).map((_, i) => i + $viewBox[1]) as y}
		<line x1={$viewBox[0]} y1={y} x2={$viewBox[0] + $viewBox[2]} y2={y} />
	{/each}
</g>
