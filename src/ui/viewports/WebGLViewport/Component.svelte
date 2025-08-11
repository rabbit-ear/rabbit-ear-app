<script lang="ts">
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import WebGLFOLD from "../../Components/WebGL/WebGLFOLD.svelte";

  type PropsType = {
    viewport: WebGLViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  // todo: adjust the shaders inside Rabbit Ear to use half the stroke width
  let strokeWidth = $derived(viewport.style.strokeWidth / 2);

  let opacity = $derived(viewport.style.opacity);
  let frontColor = $derived(opacity === 1 ? viewport.style.frontColor : "#999");
  let backColor = $derived(opacity === 1 ? viewport.style.backColor : "#999");
  let outlineColor = $derived(opacity === 1 ? viewport.style.outlineColor : "white");
</script>

<WebGLFOLD
  graph={viewport.model?.graph}
  bind:redraw={viewport.redraw}
  rightHanded={viewport.constructor.settings.rightHanded}
  perspective={viewport.view.perspective}
  viewMatrix={viewport.view.view}
  renderStyle={viewport.style.renderStyle}
  layerNudge={viewport.constructor.settings.layerNudge}
  fov={viewport.view.fov}
  darkMode={viewport.style.darkMode}
  {frontColor}
  {backColor}
  {outlineColor}
  {strokeWidth}
  opacity={viewport.style.opacity}
  showFoldedFaceOutlines={viewport.style.showFoldedFaceOutlines}
  showFoldedCreases={viewport.style.showFoldedCreases}
  showFoldedFaces={viewport.style.showFoldedFaces}
  {...rest} />
