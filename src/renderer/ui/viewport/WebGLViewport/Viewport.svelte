<script lang="ts">
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import app from "../../../app/App.svelte.ts";
  import settings from "./Settings.svelte.ts";

  type PropsType = {
    viewport: WebGLViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();
</script>

<WebGLFOLD
  graph={app.file?.graph}
  onmousemove={(...args): void => viewport.onmousemove?.(...args)}
  onmousedown={(...args): void => viewport.onmousedown?.(...args)}
  onmouseup={(...args): void => viewport.onmouseup?.(...args)}
  onmouseleave={(...args): void => viewport.onmouseleave?.(...args)}
  onwheel={(...args): void => viewport.onwheel?.(...args)}
  bind:redraw={viewport.redraw}
  perspective={viewport.view.perspective}
  viewMatrix={viewport.view.viewMatrix}
  renderStyle={settings.renderStyle}
  layerNudge={settings.layerNudge}
  fov={settings.fov}
  darkMode={settings.darkMode}
  frontColor={settings.frontColor}
  backColor={settings.backColor}
  strokeWidth={settings.strokeWidth}
  opacity={settings.opacity}
  showFoldedFaceOutlines={settings.showFoldedFaceOutlines}
  showFoldedCreases={settings.showFoldedCreases}
  showFoldedFaces={settings.showFoldedFaces}
  {...rest} />
