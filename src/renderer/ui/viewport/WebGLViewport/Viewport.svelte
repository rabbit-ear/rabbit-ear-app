<script lang="ts">
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import app from "../../../app/App.svelte.ts";

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
  renderStyle={"creasePattern"}
  viewMatrix={viewport.view.viewMatrix}
  layerNudge={0.01}
  fov={30.25}
  darkMode={true}
  frontColor={"#17F"}
  backColor={"#fff"}
  strokeWidth={0.0025}
  opacity={1}
  showFoldedFaceOutlines={true}
  showFoldedCreases={false}
  showFoldedFaces={true}
  {...rest} />
