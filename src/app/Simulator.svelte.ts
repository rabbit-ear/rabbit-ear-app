import type { FOLD } from "rabbit-ear/types.d.ts";
import { Model } from "../simulator/simulator/Model.ts";
import { untrack } from "svelte";
import type { GraphUpdateEvent } from "../graphs/Updated.ts";

export class Simulator {
  #model: Model | undefined;
  #abstractGraph: FOLD | undefined;
  #vertices_coords: [number, number, number][] = $state.raw([]);
  #effects: (() => void)[] = [];

  // set a graph here to load it into the simulator
  inputGraph: FOLD | undefined = $state();

  // this is different from the "active" toggle,
  // this will prevent the inputGraph from loading its
  // geometry and creating a bunch of WebGL buffers.
  activelyLoadingModels: boolean = $state(true);

  // turn on/off Origami Simulator's folding engine.
  // this is the GPU/battery-intensive switch,
  // leave it off when not in use.
  active = $state(false);

  // fold the origami model, float (0.0-1.0)
  foldAmount = $state(0.15);

  strain = $state(false);

  // tool is either ["trackball", "pull"], this determines how
  // to respond to a user interface: rotate model or pull a vertex
  tool = $state("trackball");

  // settings for the solver
  integration = $state("euler");
  axialStiffness = $state(20);
  faceStiffness = $state(0.2);
  joinStiffness = $state(0.7);
  creaseStiffness = $state(0.7);
  dampingRatio = $state(0.45);

  // vertex displacement error relayed back from the simulator
  error = $state(0);

  // reset the vertices back to their starting location
  reset = $state(() => { });
  exportModel = $state(() => { });

  // this is the solver loop, attach this to requestAnimationFrame
  computeLoopID: number | undefined;

  // this is the compiled graph for you to render.
  // however, this is not reactive, you will want to subscribe
  // to the reactive "updated" member for more fine-tuned info.
  // #graph: FOLD | undefined = $derived.by(() => ({
  //   vertices_coords: this.#vertices_coords,
  //   edges_vertices: this.#abstractGraph?.edges_vertices,
  //   edges_assignment: this.#abstractGraph?.edges_assignment,
  //   edges_foldAngle: this.#abstractGraph?.edges_foldAngle,
  //   faces_vertices: this.#abstractGraph?.faces_vertices,
  // }));

  get graph(): FOLD | undefined {
    return {
      vertices_coords: this.#vertices_coords,
      edges_vertices: this.#abstractGraph?.edges_vertices,
      edges_assignment: this.#abstractGraph?.edges_assignment,
      edges_foldAngle: this.#abstractGraph?.edges_foldAngle,
      faces_vertices: this.#abstractGraph?.faces_vertices,
    }
  }

  #graphUpdate: GraphUpdateEvent = $state({ isomorphic: { coords: false } });
  get graphUpdate(): GraphUpdateEvent { return this.#graphUpdate; }

  constructor() {
    this.#effects = [
      this.#makeLoadEffect(),
      this.#makeStartLoopEffect(),
      this.#makeFoldAmountEffect(),
      this.#makeStrainEffect(),
    ];
  }

  dealloc(): void {
    this.#effects.forEach((fn) => fn());
  }

  computeLoop(): void {
    this.computeLoopID = window.requestAnimationFrame(this.computeLoop.bind(this));
    this.error = this.#model?.solve(100) ?? 0;
    this.#vertices_coords = this.#model?.vertices_coords ?? [];
    this.#graphUpdate = { isomorphic: { coords: true } };
  }

  #makeStartLoopEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.computeLoopID) {
          window.cancelAnimationFrame(this.computeLoopID);
          this.computeLoopID = undefined;
        }
        if (this.active) {
          console.log("starting simulator...");
          this.computeLoop.bind(this)();
        } else {
          console.log("stopping simulator");
        }
      });
      return (): void => {
        console.log("cancelling compute loop");
        if (this.computeLoopID) {
          window.cancelAnimationFrame(this.computeLoopID);
          this.computeLoopID = undefined;
        }
      };
    });
  }

  #makeLoadEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        try {
          console.log("make load effect");
          if (this.#model) { console.log("deallocating previous simulator model"); }
          this.#model?.dealloc();
          this.#model = undefined;
          this.exportModel = () => { };
          this.reset = () => { };

          // this "active" is not the same as settings.active
          if (!this.activelyLoadingModels) { return; }
          if (!this.inputGraph) { return; }
          this.#model = new Model($state.snapshot(this.inputGraph));
          console.log("Loading simulator model from", this.inputGraph);

          this.exportModel = this.#model.export.bind(this.#model);
          this.reset = this.#model.reset.bind(this.#model);

          // edges and faces are built here and never change, only vertices need updating
          // we need to get these faces and edges from the simulator Model instead
          // of the graph given to us by the user because when the simulator loads
          // the graph, it will triangulate faces etc.. the graphs are not isomorphic.
          this.#abstractGraph = {
            edges_vertices: this.#model.fold.edges_vertices,
            edges_assignment: this.#model.fold.edges_assignment,
            edges_foldAngle: this.#model.fold.edges_foldAngle,
            faces_vertices: this.#model.fold.faces_vertices,
          };
          this.#vertices_coords = this.#model.fold.vertices_coords;
          this.#graphUpdate = { reset: true };
        } catch (error) {
          console.error(error);
        }
      });
      return (): void => {
        console.log("dealloc simulator");
        this.#model?.dealloc();
        this.#model = undefined;
        this.exportModel = () => { };
        this.reset = () => { };
      };
    });
  }

  #makeFoldAmountEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.foldAmount;
        untrack(() => {
          if (!this.#model) { return; }
          this.#model.foldAmount = this.foldAmount;
        });
      });
      // empty
      return () => { };
    });
  }

  #makeStrainEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = this.strain;
        untrack(() => {
          if (!this.#model) { return; }
          this.#model.strain = this.strain;
        });
      });
      // empty
      return () => { };
    });
  }
}

