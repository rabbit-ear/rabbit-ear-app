<script lang="ts">
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";
  import app from "../../../app/App.svelte.ts";
  import settings from "./Settings/ClassSettings.svelte.ts";

  type PropsType = {
    viewport: WebGLViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();
</script>

<WebGLFOLD
  graph={app.file?.graph}
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
  frontColor={viewport?.view?.frontColor}
  backColor={viewport?.view?.backColor}
  strokeWidth={settings.strokeWidth}
  opacity={viewport?.view?.opacity}
  showFoldedFaceOutlines={viewport?.view?.showFoldedFaceOutlines}
  showFoldedCreases={viewport?.view?.showFoldedCreases}
  showFoldedFaces={viewport?.view?.showFoldedFaces}
  {...rest} />
