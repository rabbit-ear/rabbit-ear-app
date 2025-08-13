<script lang="ts">
  import { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import MatrixView from "../../Components/MatrixView.svelte";

  let { viewport }: { viewport: WebGLViewport } = $props();

  let modelMatrix = $derived(viewport.view.model);
  let viewMatrix = $derived(viewport.view.view);
  let modelViewMatrix = $derived(viewport.view.modelView);
  let projectionMatrix = $derived(viewport.view.projection);
</script>

<div class="column">
  <p>model</p>
  <MatrixView matrix={modelMatrix} />
  <p>view</p>
  <MatrixView matrix={viewMatrix} />
  <p>model-view</p>
  <MatrixView matrix={modelViewMatrix} />
  <p>projection</p>
  <MatrixView matrix={projectionMatrix} />
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
</style>
