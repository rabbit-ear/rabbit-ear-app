<script lang="ts">
  import type { WebGLViewport } from "../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
  import type { WebGLModel } from "rabbit-ear/types.js";
  import WebGLCanvas from "./WebGLCanvas.svelte";
  import { drawModel } from "rabbit-ear/webgl/general/model.js";

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

  let models: WebGLModel[] = $derived(viewport.models.models);

  let uniforms = $derived(
    models.map((model) => model.makeUniforms(viewport.models.uniformOptions)),
  );

  $effect(() => {
    if (!gl) {
      return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    models.forEach((model, i) => drawModel(gl, version, model, uniforms[i]));
  });
</script>

<WebGLCanvas bind:gl bind:version bind:canvas bind:canvasSize bind:redraw {...props} />
