<script lang="ts">
  import * as THREE from "three";
  import { untrack } from "svelte";
  import TrackballView from "./ThreeJS/TrackballView.svelte";
  import Settings from "./state/Settings.svelte.ts";
  import Style from "./state/Style.svelte.ts";
  // origami simulator
  import { Model } from "../../src/simulator/Model.ts";
  import { MeshThree } from "../../src/three/MeshThree.ts";
  import { Highlights } from "../../src/three/Highlights.ts";
  import { Raycasters } from "../../src/three/Raycasters.ts";
  import type { RayTouch } from "../../src/three/RayTouch.ts";
  import { boundingBox, type BoundingBox } from "../../src/fold/boundingBox.ts";

  let { origami } = $props();

  // origami simulator
  let model: Model = $state();
  let mesh: MeshThree = $state();

  // model size will update the position of the lights and camera.
  // this will only update the moment the file is loaded.
  let modelSize = $state(1);

  // "touches" arises from the cursor position, it is an array containing
  // a point object for every raycasted intersection with the mesh.
  let touches: RayTouch[] = $state([]);

  // raycaster and highlighting for indicating selected vertex/face
  // and needed for the "pull" tool to pull a vertex.
  let raycasters: Raycasters;
  let highlights: Highlights;

  // three.js
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;

  // three.js lights for this scene
  const lights = [
    [+1, +1, +1],
    [-1, +1, +1],
    [+1, -1, +1],
    [-1, -1, +1],
    [+1, +1, -1],
    [-1, +1, -1],
    [+1, -1, -1],
    [-1, -1, -1],
  ].map(([x, y, z]) => {
    const light = new THREE.DirectionalLight();
    light.position.set(x, y, z);
    light.castShadow = false;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    return light;
  });

  // cleanup all memory associated with origami simulator
  const dealloc = () => {
    raycasters?.dealloc();
    highlights?.dealloc();
    model?.dealloc();
    mesh?.dealloc();
  };

  // This is the callback from ThreeView after three.js has
  // finished initializing. This is not the JS framework's builtin function.
  const didMount = ({ renderer, scene: defaultScene, camera: defaultCamera }) => {
    scene = defaultScene;
    camera = defaultCamera;
    lights.forEach((light) => scene.add(light));
    highlights = new Highlights({ parent: scene });
    raycasters = new Raycasters({
      renderer,
      camera,
      setTouches: (t: RayTouch[]) => {
        touches = t;
      },
    });
  };

  // this is the solver loop, attach this to requestAnimationFrame
  let computeLoopID: number | undefined;
  const computeLoop = () => {
    computeLoopID = window.requestAnimationFrame(computeLoop);
    Settings.error = model?.solve(100);
    mesh?.sync();
    // The raycaster will update on a mousemove event, but if the origami is
    // in a folding animation, the raycaster will not update and the visuals
    // will mismatch, hence, the raycaster can fire on a frame update if needed
    raycasters?.animate({
      active: Settings.active,
      pull: Settings.tool === "pull",
    });
  };

  // start or stop the animation loop, depending on Simulator.active
  $effect(() => {
    if (computeLoopID) {
      window.cancelAnimationFrame(computeLoopID);
      computeLoopID = undefined;
    }
    if (Settings.active) {
      computeLoop();
    }
  });

  // on file load.
  // untrack is needed to prevent re-loading at other times too.
  $effect(() => {
    const fold = $state.snapshot(origami);
    let box: BoundingBox | undefined;
    untrack(() => {
      try {
        model?.dealloc();
        mesh?.dealloc();
        model = new Model(fold);
        mesh = new MeshThree(model);
        mesh.scene = scene;
        box = boundingBox(fold);
        Settings.exportModel = model.export.bind(model);
        Settings.reset = model.reset.bind(model);
        if (highlights) {
          highlights.model = model;
        }
        if (raycasters) {
          raycasters.model = model;
          raycasters.mesh = mesh;
        }
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
    });
    if (box !== undefined) {
      modelSize = box ? Math.max(...box.span) : 1;
    }
  });

  // on file load.
  // move the camera to aspect-fit to the model
  $effect(() => {
    if (!camera) {
      return;
    }
    // scale is due to the camera's FOV
    const scale = 1.25;
    const fitLength =
      camera.aspect > 1 ? modelSize * scale : modelSize * scale * (1 / camera.aspect);
    const length = fitLength / camera.position.length();
    camera.position.multiplyScalar(length);
    camera.lookAt(0, 0, 0);
    camera.far = modelSize * 100;
    camera.near = modelSize / 100;
  });

  // on model change, update the position of the lights,
  // this is only necessary for shadows.
  $effect(() => {
    const radius = modelSize * Math.SQRT1_2;
    lights.forEach((light) => {
      light.position.normalize();
      light.position.setLength(10 * radius);
      light.shadow.camera.near = radius / 10; // 0.5 default
      light.shadow.camera.far = radius * 10; // 500 default
    });
  });

  $effect(() => {
    model.foldAmount = Settings.foldAmount;
  });

  $effect(() => {
    model.strain = Settings.strain;
    mesh.strain = Settings.strain;
  });

  $effect(() => {
    model.integration = Settings.integration;
  });
  $effect(() => {
    model.faceStiffness = Settings.faceStiffness;
  });
  $effect(() => {
    model.axialStiffness = Settings.axialStiffness;
  });
  $effect(() => {
    model.joinStiffness = Settings.joinStiffness;
  });
  $effect(() => {
    model.creaseStiffness = Settings.creaseStiffness;
  });
  $effect(() => {
    model.dampingRatio = Settings.dampingRatio;
  });

  $effect(() => {
    mesh.frontMesh.castShadow = Style.showShadows;
    mesh.frontMesh.receiveShadow = Style.showShadows;
    mesh.backMesh.receiveShadow = Style.showShadows;
  });

  $effect(() => {
    mesh.frontMesh.visible = Style.showFront;
    mesh.backMesh.visible = Style.showBack;
    mesh.lines.B.visible = Style.showBoundary;
    mesh.lines.M.visible = Style.showMountain;
    mesh.lines.V.visible = Style.showValley;
    mesh.lines.F.visible = Style.showFlat;
    mesh.lines.J.visible = Style.showJoin;
    mesh.lines.U.visible = Style.showUnassigned;
    mesh.materials.front.color.set(Style.frontColor);
    mesh.materials.back.color.set(Style.backColor);
    Object.values(mesh.lineMaterials).forEach((m) => {
      m.opacity = Style.lineOpacity;
    });
    mesh.boundaryColor = Style.boundaryColor;
    mesh.mountainColor = Style.mountainColor;
    mesh.valleyColor = Style.valleyColor;
    mesh.flatColor = Style.flatColor;
    mesh.joinColor = Style.joinColor;
    mesh.unassignedColor = Style.unassignedColor;
  });

  $effect(() => {
    [0, 3, 4, 7].forEach((i) => {
      lights[i % lights.length].castShadow = Style.showShadows;
    });
  });

  $effect(() => {
    //mesh.sync();
    //console.log("recomputing bounding box", touches[0]);
    Style.showTouches ? highlights?.highlightTouch(touches[0]) : highlights?.clear();
  });

  $effect(() => {
    if (scene) {
      scene.background = new THREE.Color(Style.backgroundColor);
    }
  });

  // nitpicky ui thing. upon tool change we need raycasterPullVertex to be undefined
  $effect(() => {
    Settings.tool;
    raycasters?.raycasterReleaseHandler();
  });

  $effect(() => dealloc);
</script>

<TrackballView
  enabled={Settings.tool !== "pull"}
  maxDistance={modelSize * 30}
  minDistance={modelSize * 0.1}
  panSpeed={1}
  rotateSpeed={4}
  zoomSpeed={16}
  dynamicDampingFactor={1}
  {didMount} />
