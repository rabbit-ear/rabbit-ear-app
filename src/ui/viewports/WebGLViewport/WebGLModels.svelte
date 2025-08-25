<script lang="ts">
  import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import type { GLModel } from "../../viewports/WebGLViewport/GLModel.ts";
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

  let models: GLModel[] = $derived(viewport.glModels.models);

  // todo: we should separate out this singular WebGLModels for individual
  // WebGLModel components, each one can be triggered to watch its update object
  // ...
  // nope. nevermind. when one model changes, the entire screen has to be redrawn
  $effect(() => {
    if (!gl) {
      return;
    }
    viewport.embedding?.graphUpdate;
    // if (!viewport.embedding?.graphUpdate) {
    //   return;
    // }
    // todo: we need to watch this new update object
    const updates = models.map((model) => model.modelUpdate);
    // console.log("redrawing WebGL with updates", models);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    models.forEach((model) => drawGLModel(gl, version, model));
  });
</script>

<WebGLCanvas bind:gl bind:version bind:canvas bind:canvasSize bind:redraw {...props} />
