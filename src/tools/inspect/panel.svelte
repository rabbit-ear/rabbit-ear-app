<script>
	import Panel from "../../components/Panels/Panel.svelte";
	import { IsolatedFrame } from "../../stores/Model.js";
	import {
		Nearest,
		TargetLocked,
	} from "./stores.js";
	import PanelVertex from "./PanelVertex.svelte";
	import PanelEdge from "./PanelEdge.svelte";
	import PanelFace from "./PanelFace.svelte";

	export let showPanel;

	$: vCount = $IsolatedFrame && $IsolatedFrame.vertices_coords
		? $IsolatedFrame.vertices_coords.length
		: 0;
	$: eCount = $IsolatedFrame && $IsolatedFrame.edges_vertices
		? $IsolatedFrame.edges_vertices.length
		: 0;
	$: fCount = $IsolatedFrame && $IsolatedFrame.faces_vertices
		? $IsolatedFrame.faces_vertices.length
		: 0;
	$: vefCount = [vCount, eCount, fCount];

	$: vNear = $Nearest ? $Nearest.vertex : undefined;
	$: eNear = $Nearest ? $Nearest.edge : undefined;
	$: fNear = $Nearest ? $Nearest.face : undefined;
</script>

<Panel {showPanel}>
	<span slot="title">Inspect</span>
	<span slot="body">
		<div class="container">
			<div class="flex-column gap">
				{#if $TargetLocked}
					<p class="strong highlight">Locked</p>
				{/if}
				<div class="flex-row">
					<p>VEF:
						<span class="strong">{vNear}</span> / 
						<span class="strong">{eNear}</span> / 
						<span class="strong">{fNear}</span>
					</p>
				</div>
				<div class="flex-row">
					<p>Size:
						<span class="strong">{vefCount[0]}</span> / 
						<span class="strong">{vefCount[1]}</span> / 
						<span class="strong">{vefCount[2]}</span>
					</p>
				</div>
				<PanelVertex />
				<PanelEdge />
				<PanelFace />
			</div>
		</div>
	</span>
</Panel>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.strong {
		font-weight: bold;
	}
	.highlight {
		color: var(--highlight);
	}
</style>
