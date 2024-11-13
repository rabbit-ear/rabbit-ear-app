<script lang="ts">
  import type { FOLD, Box } from "rabbit-ear/types.d.ts";
  import { boundingBox } from "rabbit-ear/graph/boundary.js";
  import type { SimulatorViewport } from "./SimulatorViewport.svelte.ts";
  import { untrack } from "svelte";
  //import TrackballView from "./ThreeJS/TrackballView.svelte";
  import Settings from "./Settings/Settings.svelte.ts";
  import ClassSettings from "./Settings/ClassSettings.svelte.ts";
  import { Model } from "../../../simulator/simulator/Model.ts";
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";

  type PropsType = {
    viewport: SimulatorViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  let abstractGraph: FOLD = $state({});
  let vertices_coords: [number, number, number][] = $state([]);
  let graph: FOLD = $derived({
    vertices_coords,
    edges_vertices: abstractGraph?.edges_vertices,
    edges_assignment: abstractGraph?.edges_assignment,
    edges_foldAngle: abstractGraph?.edges_foldAngle,
    faces_vertices: abstractGraph?.faces_vertices,
  });

  let model: Model = $state();
  let modelSize = $state(1);

  // cleanup all memory associated with origami simulator
  const dealloc = (): void => {
    console.log("simulator cleanup");
    if (computeLoopID) {
      window.cancelAnimationFrame(computeLoopID);
      computeLoopID = undefined;
    }
    model?.dealloc();
  };

  // this is the solver loop, attach this to requestAnimationFrame
  let computeLoopID: number | undefined;
  const computeLoop = (): void => {
    computeLoopID = window.requestAnimationFrame(computeLoop);
    ClassSettings.error = model?.solve(100);
    vertices_coords = model?.vertices_coords;
  };

  // start or stop the animation loop, depending on Settings.active
  $effect(() => {
    //console.log("updating loop", $state.snapshot(ClassSettings.active));
    if (computeLoopID) {
      window.cancelAnimationFrame(computeLoopID);
      computeLoopID = undefined;
    }
    if (ClassSettings.active) {
      computeLoop();
    }
  });

  // on file load.
  // untrack is needed to prevent re-loading at other times too.
  $effect(() => {
    const fold = $state.snapshot(viewport.model?.fold);
    let box: Box | undefined;
    untrack(() => {
      try {
        model?.dealloc();
        model = new Model(fold);
        box = boundingBox(fold);
        ClassSettings.exportModel = model.export.bind(model);
        ClassSettings.reset = model.reset.bind(model);
        // edges and faces are built here and never change, only vertices need updating
        abstractGraph = structuredClone(model.fold);
        vertices_coords = structuredClone(model.fold.vertices_coords);
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
    });
    if (box !== undefined) {
      modelSize = box ? Math.max(...box.span) : 1;
    }
  });

  $inspect(modelSize);

  //// on file load.
  //// move the camera to aspect-fit to the model
  //$effect(() => {
  //  if (!camera) {
  //    return;
  //  }
  //  // scale is due to the camera's FOV
  //  const scale = 1.25;
  //  const fitLength =
  //    camera.aspect > 1 ? modelSize * scale : modelSize * scale * (1 / camera.aspect);
  //  const length = fitLength / camera.position.length();
  //  camera.position.multiplyScalar(length);
  //  camera.lookAt(0, 0, 0);
  //  camera.far = modelSize * 100;
  //  camera.near = modelSize / 100;
  //});

  $effect(() => {
    model.foldAmount = ClassSettings.foldAmount;
  });

  $effect(() => {
    model.strain = Settings.strain;
    //mesh.strain = Settings.strain;
  });

  // cleanup when navigating away from the page.
  $effect(() => dealloc);
  //ontouchmove,
  //ontouchstart,
  //ontouchend,
  //ontouchcancel
</script>

<WebGLFOLD
  graph={$state.snapshot(graph)}
  perspective={viewport.view.perspective}
  renderStyle={viewport.view.renderStyle}
  viewMatrix={viewport.view.viewMatrix}
  bind:redraw={viewport.redraw}
  rightHanded={viewport.view.rightHanded}
  layerNudge={0.01}
  fov={viewport.view.fov}
  darkMode={true}
  frontColor={viewport.style.frontColor}
  backColor={viewport.style.backColor}
  strokeWidth={viewport.style.strokeWidth}
  showFoldedFaceOutlines={true}
  showFoldedCreases={false}
  showFoldedFaces={true}
  onmousemove={viewport.onmousemove}
  onmousedown={viewport.onmousedown}
  onmouseup={viewport.onmouseup}
  onmouseleave={viewport.onmouseleave}
  onwheel={viewport.onwheel}
  {...rest} />
