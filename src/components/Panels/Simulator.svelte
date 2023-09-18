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

	let showAdvanced = false;
</script>

<Panel>
	<span slot="title">origami simulator</span>
	<span slot="body">
		<input id="checkbox-active" type="checkbox" bind:checked={$Active} />
		<label for="checkbox-active">active</label>

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
			<label for="line-opacity">lines:</label>
			<input
				id="line-opacity"
				type="range"
				min="0"
				max="1"
				step="0.02"
				bind:value={$LineOpacity} />
		</div>
		<button
			class="button-collapse"
			on:click={() => showAdvanced = !showAdvanced}>advanced</button>

		{#if showAdvanced}
			<p>
				error
				<input
					type="text"
					class="long"
					disabled={!$Active}
					bind:value={$VertexError} />
			</p>

			<p>integration</p>
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

			<p>
				axial stiffness
				<input type="text" class="short" bind:value={$AxialStiffness} />
			</p>
			<input
				type="range"
				min="10"
				max="100"
				step="1"
				bind:value={$AxialStiffness} />

			<p>
				face stiffness
				<input type="text" class="short" bind:value={$FaceStiffness} />
			</p>

			<input
				type="range"
				min="0"
				max="5"
				step="0.02"
				bind:value={$FaceStiffness} />

			<p>
				join stiffness
				<input type="text" class="short" bind:value={$JoinStiffness} />
			</p>

			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$JoinStiffness} />

			<p>
				crease stiffness
				<input type="text" class="short" bind:value={$CreaseStiffness} />
			</p>

			<input
				type="range"
				min="0"
				max="3"
				step="0.01"
				bind:value={$CreaseStiffness} />

			<p>
				damping ratio
				<input type="text" class="short" bind:value={$DampingRatio} />
			</p>

			<input
				type="range"
				min="0.01"
				max="0.5"
				step="0.01"
				bind:value={$DampingRatio} />

			<button
				disabled={!$Active}
				on:click={$Reset}>reset model</button>
		{/if}
	</span>
</Panel>

<style>
	input[type=range] { width: 100%; }
	.long { width: 8rem; }
	.short { width: 2rem; }
	.button-collapse {
		width: 100%;
	}
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
