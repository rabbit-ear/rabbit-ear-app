<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { FoldAngleValue } from "./stores.js";
	import { convertToViewBox } from "../../js/dom.js";

	export let showPanel;

	let svg;

	let lineX, lineY;
	let lineVector = [1, 0];

	$: {
		const radians = ($FoldAngleValue / 180) * Math.PI - Math.PI;
		lineVector = [Math.cos(radians), Math.sin(radians)];
	}

	$: lineX = lineVector[0] * 15;
	$: lineY = lineVector[1] * 15;

	const lockAngles = [
		0, 15, 22.5, 30, 45, 60, 67.5, 75, 90,
		105, 112.5, 120, 135, 150, 157.5, 165, 180,
	];

	const mousemove = (e) => {
		if (!e.buttons) { return; }
		// findInParents
		const point = convertToViewBox(svg, [e.x, e.y]);
		const radiansUnclamp = Math.atan2(point[1], point[0]);
		const radians = radiansUnclamp;//Math.min(Math.PI, Math.max(0, radiansUnclamp));
		const degrees = (radians / Math.PI) * 180 + 180;
		const lockIndex = lockAngles
			.map((_, i) => i)
			.sort((a, b) => Math.abs(degrees - lockAngles[a]) - Math.abs(degrees - lockAngles[b]))
			.shift();
		$FoldAngleValue = lockAngles[lockIndex];
	}
</script>

<Panel {showPanel}>
	<span slot="title">Fold Angle</span>
	<span slot="body">
		<div class="container">
			<div class="flex-row">
				<div>
					<svg
						role="slider"
						tabindex="0"
						aria-label="fold angle select"
						aria-valuemin={0}
						aria-valuemax={180}
						aria-valuenow={$FoldAngleValue}
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-22 -22 44 24"
						bind:this={svg}
						on:mousemove={mousemove}
						>
						<g stroke-width="2" stroke-linecap="round">
							<line x1="0" y1="0" x2="15" y2="0" />
							<line x1="0" y1="0" x2={lineX} y2={lineY} />
						</g>
						<g stroke-width="1" >
							<line x1="16.5" y1="0" x2="20" y2="0" />
							<line x1="0" y1="-16.5" x2="0" y2="-20" />
							<line x1="-16.5" y1="0" x2="-20" y2="0" />
							<line x1="8.4" y1="-14.55" x2="10" y2="-17.32" />
							<line x1="-8.4" y1="-14.55" x2="-10" y2="-17.32" />
							<line x1="12" y1="-12" x2="14.14" y2="-14.14" />
							<line x1="-12" y1="-12" x2="-14.14" y2="-14.14" />
							<line x1="15" y1="-8.7" x2="17.32" y2="-10" />
							<line x1="-15" y1="-8.7" x2="-17.32" y2="-10" />
							<line x1="16.352" y1="-6.77" x2="18.477" y2="-7.653" />
							<line x1="6.77" y1="-16.352" x2="7.653" y2="-18.477" />
							<line x1="-6.77" y1="-16.352" x2="-7.653" y2="-18.477" />
							<line x1="-16.352" y1="-6.77" x2="-18.477" y2="-7.653" />
							<line x1="17.386" y1="-4.658" x2="19.31" y2="-5.176" />
							<line x1="4.658" y1="-17.386" x2="5.176" y2="-19.31" />
							<line x1="-4.658" y1="-17.386" x2="-5.176" y2="-19.31" />
							<line x1="-12.72" y1="-12.72" x2="-14.14" y2="-14.14" />
							<line x1="-17.386" y1="-4.658" x2="-19.31" y2="-5.176" />
						</g>
					</svg>
				</div>
				<div class="vertical-center">
					<div class="flex-row">
						<input
							type="text"
							bind:value={$FoldAngleValue} >
						<p class="degrees">&deg;</p>
					</div>
				</div>
			</div>
		</div>
	</span>
</Panel>

<style>
	svg {
		width: 6rem;
		height: 3rem;
		stroke: var(--text);
		fill: var(--text);
	}
	.container {
		display: flex;
		flex-direction: column;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}
	.vertical-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.degrees {
		font-size: 2rem;
	}
	input[type=text] {
		width: 100%;
		height: 1.5rem;
		font-size: 1rem;
	}
</style>
