<script>
	import Panel from "./Panel.svelte";
	import {
		Active,
		FoldAmount,
		Strain,
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
	} from "../../stores/Style.js";

	export let showPanel;

	let showAdvanced = false;
</script>

<Panel {showPanel}>
	<span slot="title">Simulator</span>
	<span slot="body">
		<div class="flex-row">
			<input id="checkbox-active" type="checkbox" bind:checked={$Active} />
			<label for="checkbox-active">active</label>
		</div>

		<input
			id="range-fold-amount"
			type="range"
			min="0"
			max="1"
			step="0.01"
			disabled={!$Active}
			bind:value={$FoldAmount} />

		<div>
			<input
				id="checkbox-strain"
				type="checkbox"
				disabled={!$Active}
				bind:checked={$Strain} />
			<label for="checkbox-strain">show strain</label>
		</div>

		<div>
			<input
				id="checkbox-show-touches"
				type="checkbox"
				bind:checked={$ShowTouches} />
			<label for="checkbox-show-touches">show touches</label>
		</div>

		<div>
			<input
				id="checkbox-show-shadows"
				type="checkbox"
				disabled={$Strain}
				bind:checked={$ShowShadows} />
			<label for="checkbox-show-shadows">show shadows</label>
		</div>

		<div>
			<label for="line-opacity">lines</label>
			<input
				id="line-opacity"
				type="range"
				min="0"
				max="1"
				step="0.02"
				bind:value={$LineOpacity} />
		</div>

		<div class="flex-row center">
			<button on:click={() => showAdvanced = !showAdvanced}>more</button>
		</div>

		{#if showAdvanced}
			<div>
				<p>error</p>
			</div>

			<div>
				<input
					type="text"
					disabled={!$Active}
					bind:value={$VertexError} />
			</div>

			<div>
				<p>integration</p>
			</div>

			<div>
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
			</div>

			<div>
				<p>axial stiffness</p>
				<input type="text" bind:value={$AxialStiffness} />
			</div>

			<input
				type="range"
				min="10"
				max="100"
				step="1"
				bind:value={$AxialStiffness} />

			<div>
				<p>face stiffness</p>
				<input type="text" bind:value={$FaceStiffness} />
			</div>

			<input
				type="range"
				min="0"
				max="5"
				step="0.02"
				bind:value={$FaceStiffness} />
			
			<div>
				<p>join stiffness</p>
				<input type="text" bind:value={$JoinStiffness} />
			</div>

			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$JoinStiffness} />
			
			<div>
				<p>crease stiffness</p>
				<input type="text" bind:value={$CreaseStiffness} />
			</div>

			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$CreaseStiffness} />
			
			<div>
				<p>damping ratio</p>
				<input type="text" bind:value={$DampingRatio} />
			</div>

			<input
				type="range"
				min="0.01"
				max="0.5"
				step="0.01"
				bind:value={$DampingRatio} />

			<div class="flex-row center">
				<button
					disabled={!$Active}
					on:click={$Reset}>reset model</button>
			</div>
		{/if}
	</span>
</Panel>

<style>
	input[type=range] {
		width: 100%;
	}
	input[type=text] {
		width: 100%;
	}
	div {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 0.25rem;
	}
	div p {
		flex: 1 0 auto;
		margin-right: 0.5rem;
	}
	div input[type=text] {
		flex: 0 1 auto;
	}
	.flex-row {
		align-items: center;
	}
</style>
