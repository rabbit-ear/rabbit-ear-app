<script lang="ts">
  import { SVGViewport } from "./SVGViewport.svelte.ts";
  // import SVGShapes from "../../Components/SVG/SVGShapes.svelte";
  import SVGFOLD from "../../Components/SVG/SVGFOLD.svelte";
  import context from "../../../app/context.svelte.ts";

  type PropsType = {
    viewport: SVGViewport;
    props?: unknown[];
  };

  let { viewport, ...props }: PropsType = $props();

  // const graph = $derived(viewport.model?.graph);
  const graph = $derived(viewport.model?.graph);
</script>

<SVGFOLD {graph} />
<!-- <SVGShapes shapes={viewport.model?.shapes} class="model-layer" /> -->
