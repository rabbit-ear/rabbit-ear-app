<script lang="ts">
  import earcut from "earcut";
  import type { FOLD, WebGLModel } from "rabbit-ear/types.js";
  import type {
    ViewportMouseEvent,
    ViewportWheelEvent,
    ViewportTouchEvent,
  } from "../../viewport/events.ts";
  import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
  import { makeModelMatrix } from "rabbit-ear/webgl/general/view.js";
  import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
  import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
  import { makeProjectionMatrix } from "rabbit-ear/webgl/general/view.js";
  import { worldAxes } from "./WorldAxes/models.js";
  // import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
  import { deallocModel } from "rabbit-ear/webgl/general/model.js";
  import { dark, light } from "rabbit-ear/webgl/general/colors.js";
  import WebGLModelView from "./WebGLModelView.svelte";
  import WebGLTouchCanvas from "./WebGLTouchCanvas.svelte";

  type PropsType = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    version?: number;
    graph?: FOLD;
    perspective?: string;
    renderStyle?: string;
    canvasSize?: [number, number];
    //projectionMatrix?: number[];
    viewMatrix?: number[];
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
    onmousedown?: (e: ViewportMouseEvent) => void;
    onmousemove?: (e: ViewportMouseEvent) => void;
    onmouseup?: (e: ViewportMouseEvent) => void;
    onmouseleave?: (e: ViewportMouseEvent) => void;
    onwheel?: (e: ViewportWheelEvent) => void;
    ontouchmove?: (e: ViewportTouchEvent) => void;
    ontouchstart?: (e: ViewportTouchEvent) => void;
    ontouchend?: (e: ViewportTouchEvent) => void;
    ontouchcancel?: (e: ViewportTouchEvent) => void;
    redraw?: () => void;
  };

  let {
    gl = $bindable(),
    version = $bindable(),
    graph = {},
    perspective = "orthographic",
    renderStyle = "creasePattern",
    canvasSize: _canvasSize = $bindable([0, 0]),
    //projectionMatrix: _projectionMatrix = $bindable([...identity4x4]),
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
  }: PropsType = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let canvasSize: [number, number] = $state([0, 0]);
  let projectionMatrix = $derived(makeProjectionMatrix(canvasSize, perspective, fov));

  $effect(() => {
    _canvasSize = canvasSize;
  });
  //$effect(() => {
  //  _projectionMatrix = projectionMatrix;
  //});

  let outlineColor = $derived(darkMode ? "white" : "black");
  let cpColor = $derived(darkMode ? "#111111" : "white");

  let modelMatrix = $derived(makeModelMatrix(graph));
  let modelViewMatrix = $derived(multiplyMatrices4(viewMatrix, modelMatrix));

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
    earcut,
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

  const deallocModels = (): void => models.forEach((model) => deallocModel(gl, model));

  // return a function to be called when the page is deallocated- deallocate the models.
  $effect(() => deallocModels);
</script>

<WebGLTouchCanvas
  bind:gl
  bind:version
  bind:canvas
  bind:redraw
  bind:canvasSize
  {projectionMatrix}
  {onmousedown}
  {onmousemove}
  {onmouseup}
  {onmouseleave}
  {onwheel}
  {ontouchstart}
  {ontouchmove}
  {ontouchend}
  {ontouchcancel} />

<WebGLModelView {gl} {version} {models} {uniformOptions} />
