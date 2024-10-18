<script lang="ts">
  import type { HTMLCanvasAttributes } from "svelte/elements";
  import type { WebGLModel } from "rabbit-ear/types.js";
  import { identity4x4 } from "rabbit-ear/math/matrix4.js";
  import { initializeWebGL } from "rabbit-ear/webgl/general/webgl.js";
  import {
    rebuildViewport,
    makeProjectionMatrix,
  } from "rabbit-ear/webgl/general/view.js";
  import { drawModel } from "rabbit-ear/webgl/general/model.js";

  type WebGLCanvasProps = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    version?: number;
    canvas?: HTMLCanvasElement;
    canvasSize?: [number, number];
    projectionMatrix?: number[];
    redraw?: () => void;
    models?: WebGLModel[];
    uniformOptions?: object;
    perspective?: string;
    fov?: number;
  } & HTMLCanvasAttributes;

  let {
    gl = $bindable(),
    version = $bindable(),
    canvas: _canvas = $bindable(),
    canvasSize = $bindable([0, 0]),
    projectionMatrix: _projectionMatrix = $bindable([...identity4x4]),
    redraw = $bindable(),
    models = [],
    uniformOptions = {},
    perspective = "orthographic",
    fov = 30.25,
    ...rest
  }: WebGLCanvasProps = $props();

  let canvas: HTMLCanvasElement | undefined = $state(undefined);
  let instance = $derived(canvas ? initializeWebGL(canvas) : undefined);
  let projectionMatrix = $derived(makeProjectionMatrix(canvasSize, perspective, fov));
  let uniforms = $derived(models.map((model) => model.makeUniforms(uniformOptions)));

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
    _projectionMatrix = [...projectionMatrix];
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

  $effect(() => {
    if (!gl) {
      return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    models.forEach((model, i) => drawModel(gl, version, model, uniforms[i]));
  });

  const onresize = (): void => {
    if (!gl || !canvas) {
      return;
    }
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  };

  //redraw = onresize;
</script>

<svelte:window {onresize} />

<canvas bind:this={canvas} {...rest}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
