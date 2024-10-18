<script lang="ts">
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import { initializeWebGL } from "rabbit-ear/webgl/general/webgl.js";
  import { rebuildViewport } from "rabbit-ear/webgl/general/view.js";

  type WebGLCanvasProps = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    version?: number;
    canvas?: HTMLCanvasElement;
    canvasSize?: [number, number];
    redraw?: () => void;
  } & HTMLCanvasAttributes;

  let {
    gl = $bindable(),
    version = $bindable(),
    canvas: _canvas = $bindable(),
    canvasSize: _canvasSize = $bindable([0, 0]),
    redraw = $bindable(),
    ...rest
  }: WebGLCanvasProps = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let canvasSize: [number, number] = $state([0, 0]);
  let instance = $derived(canvas ? initializeWebGL(canvas) : undefined);

  $effect(() => {
    gl = instance.gl;
  });
  $effect(() => {
    version = instance.version;
  });
  $effect(() => {
    _canvas = canvas;
  });
  $effect(() => {
    _canvasSize = [...canvasSize];
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

  const onresize = (): void => {
    if (!gl || !canvas) {
      return;
    }
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  };

  redraw = onresize;
</script>

<svelte:window {onresize} />

<canvas bind:this={canvas} {...rest}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
