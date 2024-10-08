<script lang="ts">
  // import earcut from "earcut";
  import type { FOLD, WebGLModel } from "rabbit-ear/types.js";
  import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
  import { initializeWebGL } from "rabbit-ear/webgl/general/webgl.js";
  import {
    rebuildViewport,
    makeProjectionMatrix,
    makeModelMatrix,
  } from "rabbit-ear/webgl/general/view.js";
  import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
  import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
  // import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
  import { drawModel, deallocModel } from "rabbit-ear/webgl/general/model.js";
  import { dark, light } from "rabbit-ear/webgl/general/colors.js";
  import { worldAxes } from "./WorldAxes/models.js";

  type WebGLCanvasProps = {
    graph: FOLD;
    perspective: string;
    renderStyle: string;
    canvasSize: [number, number];
    projectionMatrix: number[];
    viewMatrix: number[];
    layerNudge?: number;
    fov?: number;
    darkMode?: boolean;
    frontColor?: string;
    backColor?: string;
    outlineColor?: string;
    cpColor?: string;
    strokeWidth?: number;
    opacity?: number;
    showFoldedFaceOutlines?: boolean;
    showFoldedCreases?: boolean;
    showFoldedFaces?: boolean;
    onmousemove?: (e: MouseEvent) => void;
    onmousedown?: (e: MouseEvent) => void;
    onmouseup?: (e: MouseEvent) => void;
    onmouseleave?: (e: MouseEvent) => void;
    onwheel?: (e: WheelEvent) => void;
    ontouchmove?: (e: TouchEvent) => void;
    ontouchstart?: (e: TouchEvent) => void;
    ontouchend?: (e: TouchEvent) => void;
    ontouchcancel?: (e: TouchEvent) => void;
    redraw?: () => void;
  };

  let {
    graph = {},
    perspective = "orthographic",
    renderStyle = "creasePattern",
    canvasSize = $bindable([0, 0]),
    projectionMatrix: boundProjectionMatrix = $bindable([...identity4x4]),
    viewMatrix = [...identity4x4],
    layerNudge = 0.01,
    fov = 30.25,
    darkMode = true,
    frontColor = "#17F",
    backColor = "#fff",
    strokeWidth = 0.0025,
    opacity = 1,
    showFoldedFaceOutlines = true,
    showFoldedCreases = false,
    showFoldedFaces = true,
    onmousemove,
    onmousedown,
    onmouseup,
    onmouseleave,
    onwheel,
    ontouchmove,
    ontouchstart,
    ontouchend,
    ontouchcancel,
    redraw = $bindable(),
  }: WebGLCanvasProps = $props();

  let outlineColor = $derived(darkMode ? "white" : "black");
  let cpColor = $derived(darkMode ? "#111111" : "white");

  let canvas: HTMLCanvasElement | undefined = $state(undefined);
  let { gl, version } = $derived(
    canvas ? initializeWebGL(canvas) : { gl: undefined, version: 0 },
  );
  //let canvasSize: [number, number] = $state([1, 1]);
  let modelMatrix = $derived(makeModelMatrix(graph));
  let modelViewMatrix = $derived(multiplyMatrices4(viewMatrix, modelMatrix));
  let projectionMatrix = $derived(makeProjectionMatrix(canvasSize, perspective, fov));

  $effect(() => {
    boundProjectionMatrix = [...projectionMatrix];
  });
  //$effect(() => {
  //  boundCanvasSize = [...canvasSize];
  //});

  let uniformOptions = $derived({
    projectionMatrix,
    modelViewMatrix,
    canvas,
    frontColor,
    backColor,
    outlineColor,
    cpColor,
    strokeWidth,
    opacity,
  });

  let programOptions = $derived({
    ...(darkMode ? dark : light),
    layerNudge,
    outlines: showFoldedFaceOutlines,
    edges: showFoldedCreases,
    faces: showFoldedFaces,
    // earcut,
  });

  let models: WebGLModel[] = $derived.by(() => {
    try {
      if (!gl) {
        return [];
      }
      // deallocModels();
      return renderStyle === "creasePattern"
        ? [
            ...creasePattern(gl, version, graph, programOptions),
            ...worldAxes(gl),
            // ...touchIndicators(gl, programOptions),
          ]
        : [
            ...foldedForm(gl, version, graph, programOptions),
            ...worldAxes(gl),
            // ...touchIndicators(gl, programOptions),
          ];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  let uniforms = $derived(models.map((model) => model.makeUniforms(uniformOptions)));

  const deallocModels = (): void => models.forEach((model) => deallocModel(gl, model));

  const onresize = (): void => {
    if (!gl || !canvas) {
      return;
    }
    rebuildViewport(gl, canvas);
    canvasSize = [canvas.clientWidth, canvas.clientHeight];
  };

  redraw = onresize;

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

  // return a function to be called when the page is deallocated- deallocate the models.
  $effect(() => deallocModels);
</script>

<svelte:window {onresize} />

<canvas
  bind:this={canvas}
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}
  {onwheel}
  {ontouchstart}
  {ontouchmove}
  {ontouchend}
  {ontouchcancel}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
