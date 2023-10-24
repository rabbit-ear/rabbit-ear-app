<script>
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import { GhostGraphCP } from "../../stores/UI.js";
</script>

<g class="graph-preview-layer">
	<FacesLayer graph={$GhostGraphCP} />
	<EdgesLayer graph={$GhostGraphCP} />
	<VerticesLayer graph={$GhostGraphCP} />
</g>
