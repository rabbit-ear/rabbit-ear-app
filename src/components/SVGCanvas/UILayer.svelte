<script>
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesLayer from "./FacesLayer.svelte";
	import { UIGraph } from "../../stores/UI.js";
</script>

<g class="graph-preview-layer">
	<FacesLayer graph={$UIGraph} />
	<EdgesLayer graph={$UIGraph} />
	<VerticesLayer graph={$UIGraph} />
</g>
