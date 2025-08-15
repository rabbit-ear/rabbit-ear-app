<script lang="ts">
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { initializeWebGL } from "rabbit-ear/webgl/general/webgl.js";
  import { rebuildViewport } from "rabbit-ear/webgl/general/view.js";

  type WebGLCanvasProps = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext | undefined;
    version?: number;
    canvas?: HTMLCanvasElement | undefined;
    canvasSize?: [number, number];
    redraw?: () => void;
  } & HTMLCanvasAttributes;

  let {
    gl = $bindable(),
    version = $bindable(),
    canvas = $bindable(),
    canvasSize = $bindable([0, 0]),
    redraw = $bindable(),
    ...rest
  }: WebGLCanvasProps = $props();

  // initialize the gl context and save the WebGL version (1 or 2)
  let { gl: glContext, version: contextVersion } = $derived(
    canvas ? initializeWebGL(canvas) : { gl: undefined, version: undefined },
  );

  // allow outside components to trigger a redraw
  redraw = (): void => {
    console.log("WebGL rebuildViewport(), new canvas size");
    if (!gl || !canvas) {
      return;
    }
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  };

  // upon initialization
  $effect(() => {
    gl = glContext;
    version = contextVersion;
    gl?.enable(gl.BLEND);
    gl?.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  });

  // todo: this seems to be unnecessary. idk why
  // if canvas has changed, rebuild the viewport, save new canvas size
  // $effect(() => {
  //   if (canvas) redraw();
  // });

  // do not use. use the method above. delete when verified that we don't need this.
  // $effect(() => {
  //   if (!gl || !canvas) {
  //     return;
  //   }
  //   rebuildViewport(gl, canvas);
  //   canvasSize = [canvas.clientWidth, canvas.clientHeight];
  // });
</script>

<svelte:window onresize={redraw} />

<canvas bind:this={canvas} {...rest}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
