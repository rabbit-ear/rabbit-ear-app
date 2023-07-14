<script>
	import { ViewBox } from "../../stores/ViewBox.js";

	let origin = [0, 0];
	$: origin = [-$ViewBox[0], -$ViewBox[1]];

	let factors = [{}, {}];
	$: {
		const size = [$ViewBox[2], $ViewBox[3]].map(n => Math.ceil(n));
		factors = Array.from(Array(2)).map((_, dim) => {
			const result = Array(size[dim] + 1).fill(0);
			Array.from(Array(size[dim]))
				.map((_, i) => i)
				.map(i => ({ i, n: size[dim] / i }))
				.filter(el => el.n == parseInt(el.n, 10))
				.map(el => el.i)
				.forEach(i => {
					let n = i;
					while (n < size[dim]) {
						result[n] += 1;
						n += i;
					}
				});
				return result;
		});
	}
</script>

<g class="grid" stroke-width={Math.max($ViewBox[2], $ViewBox[3]) / 400}>
	{#each Array.from(Array(Math.ceil($ViewBox[2]) + 1)).map((_, i) => i + $ViewBox[0]) as x}
		<line
			x1={origin[0] + x}
			y1={origin[1] + $ViewBox[1]}
			x2={origin[0] + x}
			y2={origin[1] + $ViewBox[1] + $ViewBox[3]}
			stroke-width={$ViewBox[2] * 0.001 + factors[0][x] * 0.02}
		/>
	{/each}
	{#each Array.from(Array(Math.ceil($ViewBox[3]) + 1)).map((_, i) => i + $ViewBox[1]) as y}
		<line
			x1={origin[0] + $ViewBox[0]}
			y1={origin[1] + y}
			x2={origin[0] + $ViewBox[0] + $ViewBox[2]}
			y2={origin[1] + y}
			stroke-width={$ViewBox[2] * 0.001 + factors[1][y] * 0.02}
		/>
	{/each}
</g>
