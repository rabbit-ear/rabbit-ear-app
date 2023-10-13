<script>
	import Panel from "./Panel.svelte";
	import {
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
</script>

<Panel>
	<span slot="title">Style</span>
	<span slot="body">
		<div class="flex-column gap">

			<p>Folded</p>

			<div class="flex-row center">
				<input type="color" bind:value={$BackColor} />
				<input type="color" bind:value={$FrontColor} />
			</div>

			<p>Crease Pattern</p>

			<div class="flex-row center">
				<div class="flex-column center gap">
					<input
						type="color"
						id="color-boundary"
						title="boundary"
						bind:value={$BoundaryColor} />
					<label for="color-boundary">B</label>
				</div>

				<div class="flex-column center gap">
					<input
						type="color"
						id="color-mountain"
						title="mountain"
						bind:value={$MountainColor} />
					<label for="color-mountain">M</label>
				</div>

				<div class="flex-column center gap">
					<input
						type="color"
						id="color-valley"
						title="valley"
						bind:value={$ValleyColor} />
					<label for="color-valley">V</label>
				</div>

				<div class="flex-column center gap">
					<input
						type="color"
						id="color-flat"
						title="flat"
						bind:value={$FlatColor} />
					<label for="color-flat">F</label>
				</div>

				<div class="flex-column center gap">
					<input
						type="color"
						id="color-join"
						title="join"
						bind:value={$JoinColor} />
					<label for="color-join">J</label>
				</div>

				<div class="flex-column center gap">
					<input
						type="color"
						id="color-unassigned"
						title="unassigned"
						bind:value={$UnassignedColor} />
					<label for="color-unassigned">U</label>
				</div>
			</div>

		</div>
	</span>
</Panel>

<style>
	.center {
		align-items: center;
	}
</style>
