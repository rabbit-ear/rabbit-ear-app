<script>
	import { clipLineConvexPolygon } from "rabbit-ear/math/intersect/clip.js";
	import { rulerLines } from "../../stores/ruler.js";
	import { snapPoints } from "../../stores/snap.js";
	import { viewBox } from "../../stores/app.js";

	const clipLineInLargerViewBox = (line, box) => {
		const [x, y, w, h] = box;
		const polygon = [
			[x - (w * 10), y - (h * 10)],
			[x + (w * 11), y - (h * 10)],
			[x + (w * 11), y + (h * 11)],
			[x - (w * 10), y + (h * 11)],
		];
		return clipLineConvexPolygon(polygon, line);
	};

	const clipLineInViewBox = (line, box) => {
		const polygon = [
			[box[0], box[1]],
			[box[0] + box[2], box[1]],
			[box[0] + box[2], box[1] + box[3]],
			[box[0], box[1] + box[3]],
		];
		return clipLineConvexPolygon(polygon, line);
	};

	let segments;
	$: segments = $rulerLines
		.map(line => clipLineInLargerViewBox(line, $viewBox))
		.filter(res => res !== undefined)
		.filter(res => res.length > 1);

	let vmax;
	$: vmax = Math.max($viewBox[2], $viewBox[3]);

	let tick = 0
	setInterval(() => { tick += (vmax * 0.002); }, 30);
</script>

<g>
	{#each segments as s}
		<line
			x1={s[0][0]}
			y1={s[0][1]}
			x2={s[1][0]}
			y2={s[1][1]}
			stroke="#fff8"
			stroke-dasharray={[vmax * 0.01, vmax * 0.01].join(" ")}
			stroke-dashoffset={tick}
		/>
	{/each}
	{#each $snapPoints as p}
		<circle cx={p[0]} cy={p[1]} r={0.01} fill="red" />
	{/each}
</g>
