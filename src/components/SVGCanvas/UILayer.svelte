<script>
	import VerticesLayer from "./VerticesLayer.svelte";
	import EdgesLayer from "./EdgesLayer.svelte";
	import FacesCPLayer from "./FacesCPLayer.svelte";
	import { UIGraph } from "../../stores/UI.js";
</script>

<g class="graph-preview-layer">
	<FacesCPLayer graph={$UIGraph} />
	<EdgesLayer graph={$UIGraph} />
	<VerticesLayer graph={$UIGraph} />
</g>
