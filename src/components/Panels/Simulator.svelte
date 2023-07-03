<script>
	import Panel from "./Panel.svelte";
	import {
		active,
		foldAmount,
		strain,
		tool,
		error,
		reset,
		exportModel,
	} from "../../stores/simulator.js";
	import {
		integration,
		axialStiffness,
		faceStiffness,
		joinStiffness,
		creaseStiffness,
		dampingRatio,
	} from "../../stores/solver.js";
	import {
		showTouches,
		showShadows,
		showFront,
		showBack,
		showBoundary,
		showMountain,
		showValley,
		showFlat,
		showJoin,
		showUnassigned,
		backgroundColor,
		frontColor,
		backColor,
		lineOpacity,
		boundaryColor,
		mountainColor,
		valleyColor,
		flatColor,
		joinColor,
		unassignedColor,
	} from "../../stores/style.js";

	const saveFoldFile = () => {
		const FOLD = $exportModel();
		const a = document.createElement("a");
		a.style = "display: none";
		document.body.appendChild(a);
		const blob = new Blob([JSON.stringify(FOLD)], { type: "octet/stream" });
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = "origami.fold";
		a.click();
		window.URL.revokeObjectURL(url);
	};
</script>

<Panel>
	<span slot="title">origami simulator</span>
	<span slot="body">
		<h3>
			active
			<input type="checkbox" bind:checked={$active} />
		</h3>

		<h3>fold amount</h3>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			disabled={!$active}
			bind:value={$foldAmount} />

		<h3>touch</h3>
		<input
			type="radio"
			id="radio-webgl-tool-trackball"
			name="radio-webgl-tool"
			bind:group={$tool}
			value="trackball" />
		<label for="radio-webgl-tool-trackball">rotate</label>
		<input
			type="radio"
			id="radio-webgl-tool-pull"
			name="radio-webgl-tool"
			bind:group={$tool}
			value="pull" />
		<label for="radio-webgl-tool-pull">grab</label>

		<h3>
			show strain
			<input type="checkbox" disabled={!$active} bind:checked={$strain} />
		</h3>

		<h3>
			show touches
			<input type="checkbox" bind:checked={$showTouches} />
		</h3>

		<h3>
			show shadows
			<input type="checkbox" disabled={$strain} bind:checked={$showShadows} />
		</h3>

		<button>style</button>
		<div class="collabsible">
			<h3>
				background
				<input type="text" class="medium" bind:value={$backgroundColor} />
			</h3>

			<h3>
				front
				<input
					type="checkbox"
					id="show-faces-front"
					bind:checked={$showFront} />
				<input type="text" class="medium" bind:value={$frontColor} />
			</h3>
			<h3>
				back
				<input
					type="checkbox"
					id="show-faces-back"
					bind:checked={$showBack} />
				<input type="text" class="medium" bind:value={$backColor} />
			</h3>

			<h3>
				lines
			</h3>
			<input
				type="range"
				min="0"
				max="1"
				step="0.02"
				bind:value={$lineOpacity} />
			<div>
				<input
					type="checkbox"
					id="show-line-boundary"
					bind:checked={$showBoundary} />
				<input type="text" class="medium" bind:value={$boundaryColor} />
				<label for="show-line-boundary">boundary</label>
				<br />
				<input
					type="checkbox"
					id="show-line-mountain"
					bind:checked={$showMountain} />
				<input type="text" class="medium" bind:value={$mountainColor} />
				<label for="show-line-mountain">mountain</label>
				<br />
				<input
					type="checkbox"
					id="show-line-valley"
					bind:checked={$showValley} />
				<input type="text" class="medium" bind:value={$valleyColor} />
				<label for="show-line-valley">valley</label>
				<br />
				<input
					type="checkbox"
					id="show-line-flat"
					bind:checked={$showFlat} />
				<input type="text" class="medium" bind:value={$flatColor} />
				<label for="show-line-flat">flat</label>
				<br />
				<input
					type="checkbox"
					id="show-line-join"
					bind:checked={$showJoin} />
				<input type="text" class="medium" bind:value={$joinColor} />
				<label for="show-line-join">triangulated</label>
				<br />
				<input
					type="checkbox"
					id="show-line-unassigned"
					bind:checked={$showUnassigned} />
				<input type="text" class="medium" bind:value={$unassignedColor} />
				<label for="show-line-unassigned">unassigned</label>
			</div>
		</div>

		<button>advanced</button>
		<div class="collabsible">

			<h3>integration</h3>
			<input
				type="radio"
				name="radio-integration"
				id="radio-integration-euler"
				value="euler"
				bind:group={$integration} />
			<label for="radio-integration-euler">euler</label>
			<input
				type="radio"
				name="radio-integration"
				id="radio-integration-verlet"
				value="verlet"
				bind:group={$integration} />
			<label for="radio-integration-verlet">verlet</label>

			<h3>
				axial stiffness
				<input type="text" class="short" bind:value={$axialStiffness} />
			</h3>
			<input
				type="range"
				min="10"
				max="100"
				step="1"
				bind:value={$axialStiffness} />

			<h3>
				face stiffness
				<input type="text" class="short" bind:value={$faceStiffness} />
			</h3>
			<input
				type="range"
				min="0"
				max="5"
				step="0.02"
				bind:value={$faceStiffness} />

			<h3>
				join stiffness
				<input type="text" class="short" bind:value={$joinStiffness} />

			</h3>
			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$joinStiffness} />

			<h3>
				crease stiffness
				<input type="text" class="short" bind:value={$creaseStiffness} />

			</h3>
			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$creaseStiffness} />

			<h3>
				damping ratio
				<input type="text" class="short" bind:value={$dampingRatio} />

			</h3>
			<input
				type="range"
				min="0.01"
				max="0.5"
				step="0.01"
				bind:value={$dampingRatio} />

			<h3>
				error
				<input type="text" class="long" disabled={!$active} bind:value={$error} />
			</h3>

			<button
				disabled={!$active}
				on:click={$reset}>reset model</button>
		</div>

		<button on:click={saveFoldFile}>export model as FOLD</button>

	</span>
</Panel>

<style>
	.long { width: 8rem; }
	.medium { width: 5rem; }
	.short { width: 3rem; }
	.collabsible {
		display: none;
	}
</style>
