<script lang="ts">
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";
  import settings from "./Settings/ClassSettings.svelte.ts";

  type PropsType = {
    viewport: WebGLViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  let opacity = $derived(viewport?.view?.opacity);
  let frontColor = $derived(opacity === 1 ? viewport?.view?.frontColor : "#999");
  let backColor = $derived(opacity === 1 ? viewport?.view?.backColor : "#999");
  let outlineColor = $derived(opacity === 1 ? viewport?.view?.outlineColor : "white");
</script>

<WebGLFOLD
  graph={viewport.model?.fold}
  onmousemove={viewport.onmousemove}
  onmousedown={viewport.onmousedown}
  onmouseup={viewport.onmouseup}
  onmouseleave={viewport.onmouseleave}
  onwheel={viewport.onwheel}
  bind:redraw={viewport.redraw}
  rightHanded={settings.rightHanded}
  perspective={viewport?.view?.perspective}
  viewMatrix={viewport?.view?.viewMatrix}
  renderStyle={viewport?.view?.renderStyle}
  layerNudge={settings.layerNudge}
  fov={viewport.view.fov}
  darkMode={viewport?.view?.darkMode}
  {frontColor}
  {backColor}
  {outlineColor}
  strokeWidth={settings.strokeWidth}
  opacity={viewport?.view?.opacity}
  showFoldedFaceOutlines={viewport?.view?.showFoldedFaceOutlines}
  showFoldedCreases={viewport?.view?.showFoldedCreases}
  showFoldedFaces={viewport?.view?.showFoldedFaces}
  {...rest} />
