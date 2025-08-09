<script lang="ts">
  //import { untrack } from "svelte";
  import earcut from "earcut";
  import type { FOLD, WebGLModel } from "rabbit-ear/types.js";
  import type { ViewportEvents } from "../../viewport/ViewportTypes.ts";
  import { identity4x4, multiplyMatrices4 } from "rabbit-ear/math/matrix4.js";
  import { makeModelMatrix } from "rabbit-ear/webgl/general/view.js";
  import { creasePattern } from "rabbit-ear/webgl/creasePattern/models.js";
  import { foldedForm } from "rabbit-ear/webgl/foldedForm/models.js";
  //import { makeProjectionMatrix } from "rabbit-ear/webgl/general/view.js";
  //import { worldAxes } from "./WorldAxes/models.js";
  // import { touchIndicators } from "rabbit-ear/webgl/touches/models.js";
  import { deallocModel } from "rabbit-ear/webgl/general/model.js";
  import { dark, light } from "rabbit-ear/webgl/general/colors.js";
  import WebGLModelView from "./WebGLModelView.svelte";
  import WebGLTouchCanvas from "./WebGLTouchCanvas.svelte";
  import { makeProjectionMatrix } from "../../../general/matrix.ts";

  type PropsType = ViewportEvents & {
    graph?: FOLD;
    rightHanded?: boolean;
    perspective?: string;
    renderStyle?: string;
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
    redraw?: () => void;
  };

  let {
    graph = {},
    rightHanded = true,
    perspective = "orthographic",
    renderStyle = "creasePattern",
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

  let gl: WebGLRenderingContext | WebGL2RenderingContext = $state();
  let version: number = $state();
  let canvas: HTMLCanvasElement | undefined = $state();
  let canvasSize: [number, number] = $state([0, 0]);

  let projectionMatrix = $derived(
    makeProjectionMatrix(canvasSize, perspective, fov, rightHanded),
  );
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
      //const startTime = performance.now();
      // todo: need to delete buffers and programs (call deallocModels()).
      //untrack(() => deallocModels());
      const models =
        renderStyle === "creasePattern"
          ? [
              ...creasePattern(gl, version, graph, programOptions),
              //...worldAxes(gl),
              // ...touchIndicators(gl, programOptions),
            ]
          : [
              ...foldedForm(gl, version, graph, programOptions),
              //...worldAxes(gl),
              // ...touchIndicators(gl, programOptions),
            ];
      // remove the one flag that is on by default: DepthTest.
      // this nicely renders the transparent faces and prevents z-fighting
      if (opacity < 1.0) {
        models.forEach((model) => (model.flags = []));
      }
      //console.log("WebGL make models (ms):", performance.now() - startTime);
      return models;
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
  bind:canvasSize
  bind:redraw
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
