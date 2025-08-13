<script lang="ts">
  import { onMount } from "svelte";
  import type { WebGLViewport } from "./WebGLViewport.svelte.ts";
  import WebGLModels from "../../Components/WebGL/WebGLModels.svelte";

  type PropsType = {
    viewport: WebGLViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  let gl: WebGLRenderingContext | WebGL2RenderingContext | undefined = $state();
  let version: number = $state(2);
  let canvas: HTMLCanvasElement | undefined = $state();
  let canvasSize: [number, number] = $state([0, 0]);

  $effect(() => {
    viewport.gl = gl;
  });

  $effect(() => {
    viewport.version = version;
  });

  $effect(() => {
    viewport.domElement = canvas;
  });

  $effect(() => {
    viewport.view.canvasSize = canvasSize;
    console.log("setting canvas size", canvasSize);
  });

  onMount(() => {
    // console.log("SVGViewport has mounted", viewport.domElement);
    if (typeof viewport.didMount === "function") {
      viewport.didMount();
    }
  });
</script>

<WebGLModels
  {viewport}
  bind:gl
  bind:version
  bind:canvas
  bind:canvasSize
  bind:redraw={viewport.redraw}
  {...rest} />
