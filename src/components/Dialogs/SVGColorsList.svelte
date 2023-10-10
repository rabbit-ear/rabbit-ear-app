<script>
	import { edgesAssignmentNames } from "rabbit-ear/fold/spec.js";
	import { rgbToHex } from "rabbit-ear/svg/colors/convert.js";
	export let assignments = {};
	const allAssignments = ["B", "M", "V", "F", "J", "C", "U"];

	const formatRGB = (color) => {
		const matches = color.match(/\(([^)]+)\)/);
		if (matches == null) { return color; }
		const numberString = matches[1];
		const numbers = numberString.split(/[ ,]+/).map(n => parseInt(n));
		return numbers.length === 3 ? rgbToHex(...numbers) : color;
	};
</script>

<div class="container">
	{#each Object.keys(assignments) as color, i}
		<div>
			<select bind:value={assignments[color]}>
				{#each allAssignments as assign}
					<option value={assign}>
						{edgesAssignmentNames[assign]}
					</option>
				{/each}
			</select>
			<span style={`color: ${color};`}>{formatRGB(color)}</span>
		</div>
	{/each}
</div>

<style>
	.container {
		max-height: 10rem;
		overflow-y: scroll;
		margin: auto;
	}
	span {
		color: #bbb;
		font-weight: bold;
		margin-left: 0.5rem;
	}
</style>
