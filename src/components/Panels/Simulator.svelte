<script>
	import Panel from "./Panel.svelte";
	import {
		Active,
		FoldAmount,
		Strain,
		Tool,
		VertexError,
		Reset,
		ExportModel,
	} from "../../stores/simulator.js";
	import {
		Integration,
		AxialStiffness,
		FaceStiffness,
		JoinStiffness,
		CreaseStiffness,
		DampingRatio,
	} from "../../stores/Solver.js";
	import {
		ShowTouches,
		ShowShadows,
		ShowFront,
		ShowBack,
		ShowBoundary,
		ShowMountain,
		ShowValley,
		ShowFlat,
		ShowJoin,
		ShowUnassigned,
		BackgroundColor,
		FrontColor,
		BackColor,
		LineOpacity,
		BoundaryColor,
		MountainColor,
		ValleyColor,
		FlatColor,
		JoinColor,
		UnassignedColor,
	} from "../../stores/Style.js";

	const saveFoldFile = () => {
		const FOLD = $ExportModel();
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
			<input type="checkbox" bind:checked={$Active} />
		</h3>

		<h3>fold amount</h3>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			disabled={!$Active}
			bind:value={$FoldAmount} />

		<h3>touch</h3>
		<input
			type="radio"
			id="radio-webgl-tool-trackball"
			name="radio-webgl-tool"
			bind:group={$Tool}
			value="trackball" />
		<label for="radio-webgl-tool-trackball">rotate</label>
		<input
			type="radio"
			id="radio-webgl-tool-pull"
			name="radio-webgl-tool"
			bind:group={$Tool}
			value="pull" />
		<label for="radio-webgl-tool-pull">grab</label>

		<h3>
			show strain
			<input type="checkbox" disabled={!$Active} bind:checked={$Strain} />
		</h3>

		<h3>
			show touches
			<input type="checkbox" bind:checked={$ShowTouches} />
		</h3>

		<h3>
			show shadows
			<input type="checkbox" disabled={$Strain} bind:checked={$ShowShadows} />
		</h3>

		<button>style</button>
		<div class="collabsible">
			<h3>
				background
				<input type="text" class="medium" bind:value={$BackgroundColor} />
			</h3>

			<h3>
				front
				<input
					type="checkbox"
					id="show-faces-front"
					bind:checked={$ShowFront} />
				<input type="text" class="medium" bind:value={$FrontColor} />
			</h3>
			<h3>
				back
				<input
					type="checkbox"
					id="show-faces-back"
					bind:checked={$ShowBack} />
				<input type="text" class="medium" bind:value={$BackColor} />
			</h3>

			<h3>
				lines
			</h3>
			<input
				type="range"
				min="0"
				max="1"
				step="0.02"
				bind:value={$LineOpacity} />
			<div>
				<input
					type="checkbox"
					id="show-line-boundary"
					bind:checked={$ShowBoundary} />
				<input type="text" class="medium" bind:value={$BoundaryColor} />
				<label for="show-line-boundary">boundary</label>
				<br />
				<input
					type="checkbox"
					id="show-line-mountain"
					bind:checked={$ShowMountain} />
				<input type="text" class="medium" bind:value={$MountainColor} />
				<label for="show-line-mountain">mountain</label>
				<br />
				<input
					type="checkbox"
					id="show-line-valley"
					bind:checked={$ShowValley} />
				<input type="text" class="medium" bind:value={$ValleyColor} />
				<label for="show-line-valley">valley</label>
				<br />
				<input
					type="checkbox"
					id="show-line-flat"
					bind:checked={$ShowFlat} />
				<input type="text" class="medium" bind:value={$FlatColor} />
				<label for="show-line-flat">flat</label>
				<br />
				<input
					type="checkbox"
					id="show-line-join"
					bind:checked={$ShowJoin} />
				<input type="text" class="medium" bind:value={$JoinColor} />
				<label for="show-line-join">triangulated</label>
				<br />
				<input
					type="checkbox"
					id="show-line-unassigned"
					bind:checked={$ShowUnassigned} />
				<input type="text" class="medium" bind:value={$UnassignedColor} />
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
				bind:group={$Integration} />
			<label for="radio-integration-euler">euler</label>
			<input
				type="radio"
				name="radio-integration"
				id="radio-integration-verlet"
				value="verlet"
				bind:group={$Integration} />
			<label for="radio-integration-verlet">verlet</label>

			<h3>
				axial stiffness
				<input type="text" class="short" bind:value={$AxialStiffness} />
			</h3>
			<input
				type="range"
				min="10"
				max="100"
				step="1"
				bind:value={$AxialStiffness} />

			<h3>
				face stiffness
				<input type="text" class="short" bind:value={$FaceStiffness} />
			</h3>
			<input
				type="range"
				min="0"
				max="5"
				step="0.02"
				bind:value={$FaceStiffness} />

			<h3>
				join stiffness
				<input type="text" class="short" bind:value={$JoinStiffness} />

			</h3>
			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$JoinStiffness} />

			<h3>
				crease stiffness
				<input type="text" class="short" bind:value={$CreaseStiffness} />

			</h3>
			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$CreaseStiffness} />

			<h3>
				damping ratio
				<input type="text" class="short" bind:value={$DampingRatio} />

			</h3>
			<input
				type="range"
				min="0.01"
				max="0.5"
				step="0.01"
				bind:value={$DampingRatio} />

			<h3>
				error
				<input type="text" class="long" disabled={!$Active} bind:value={$VertexError} />
			</h3>

			<button
				disabled={!$Active}
				on:click={$Reset}>reset model</button>
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
