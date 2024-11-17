<script lang="ts">
  import type { FOLD } from "rabbit-ear/types.d.ts";
  import type { SimulatorViewport } from "./SimulatorViewport.svelte.ts";
  import WebGLFOLD from "../../components/WebGL/WebGLFOLD.svelte";
  import app from "../../../app/App.svelte.ts";

  type PropsType = {
    viewport: SimulatorViewport;
    rest?: unknown[];
  };

  let { viewport, ...rest }: PropsType = $props();

  let graph: FOLD = $derived({
    vertices_coords: app.simulator.vertices_coords,
    edges_vertices: app.simulator.abstractGraph?.edges_vertices,
    edges_assignment: app.simulator.abstractGraph?.edges_assignment,
    edges_foldAngle: app.simulator.abstractGraph?.edges_foldAngle,
    faces_vertices: app.simulator.abstractGraph?.faces_vertices,
  });

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

  //$effect(() => {
  //  model.strain = Settings.strain;
  //  //mesh.strain = Settings.strain;
  //});

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
