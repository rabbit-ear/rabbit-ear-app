<script>
	import { Nearest } from "./stores.js";
	import {
		IsolatedFrame,
		IsoUpdateFrame,
	} from "../../stores/Model.js";

	$: isValid = $IsolatedFrame && $Nearest && $Nearest.face !== undefined;
	$: face = isValid ? $Nearest.face : undefined;

	$: vertices = isValid
		&& $IsolatedFrame.faces_vertices
		&& $IsolatedFrame.faces_vertices.length > face
		? $IsolatedFrame.faces_vertices[face]
		: [];
</script>

{#if isValid}
	<div class="flex-column gap">
		<p class="title">face</p>
		<div class="flex-row gap">
			<p>vertices: <span class="strong">{vertices.join(", ")}</span></p>
		</div>
	</div>
{/if}

<style>
	.title {
		font-weight: bold;
		color: var(--bright);
	}
	.strong {
		font-weight: bold;
	}
</style>
