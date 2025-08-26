<script lang="ts">
  import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import { drawGLModel } from "../../viewports/WebGLViewport/GLModel.ts";
  import WebGLCanvas from "./WebGLCanvas.svelte";

  type PropsType = {
    viewport: WebGLViewport;
    gl: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    version: number;
    canvas: HTMLCanvasElement | undefined;
    canvasSize: [number, number];
    redraw?: () => void;
  };

  let {
    viewport,
    gl = $bindable(),
    version = $bindable(),
    canvas = $bindable(),
    canvasSize = $bindable(),
    redraw = $bindable(),
    ...props
  }: PropsType = $props();

  $effect(() => {
    if (!gl) {
      return;
    }
    viewport.embedding;
    viewport.embedding?.graphUpdate.reset;
    viewport.embedding?.graphUpdate.structural;
    // console.log("Component: WebGLModels: redraw");
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewport.glModels.models.forEach((model) => drawGLModel(gl, version, model));
  });
</script>

<WebGLCanvas bind:gl bind:version bind:canvas bind:canvasSize bind:redraw {...props} />
