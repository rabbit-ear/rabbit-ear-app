<script lang="ts">
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { initializeWebGL } from "rabbit-ear/webgl/general/webgl.js";
  import { rebuildViewport } from "rabbit-ear/webgl/general/view.js";

  type WebGLCanvasProps = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
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

  let instance = $derived(canvas ? initializeWebGL(canvas) : undefined);

  $effect(() => {
    gl = instance.gl;
    version = instance.version;
  });

  $effect(() => {
    if (!gl || !canvas) {
      return;
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  });

  redraw = (): void => {
    if (!gl || !canvas) {
      return;
    }
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  };
</script>

<svelte:window onresize={redraw} />

<canvas bind:this={canvas} {...rest}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
