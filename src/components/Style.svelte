<script>
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
	} from "../stores/Style.js";
</script>

	<div>

		<input type="text" class="medium" bind:value={$FrontColor} />
		<input type="text" class="medium" bind:value={$BackgroundColor} />

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
