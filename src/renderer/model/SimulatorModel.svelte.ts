import type { FOLD, Box } from "rabbit-ear/types.d.ts";
import type { IModel } from "./Model.svelte.ts";
import type { Models } from "./Models.svelte.ts";
import type { FrameStyle } from "../file/FrameStyle.ts";
import type { Shape } from "../geometry/shapes.ts";
import type { SolverOptions } from "../simulator/simulator/GPUMath.ts";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { Model } from "../simulator/simulator/Model.ts";
import { Settings } from "./SimulatorSettings.svelte.ts";

export class SimulatorModel implements IModel {
  name: string = "simulator";
  #models: Models;

  model: Model;
  options: SolverOptions;
  settings: Settings;

  inputFrame: FOLD = $derived.by(() => this.#models.frameFlat);
  abstractGraph: FOLD;
  vertices_coords: [number, number, number][] = $state.raw([]);

  modelSize: number = $derived.by(() => {
    const box: Box | undefined = boundingBox(this.inputFrame);
    return box ? Math.max(...box.span) : 1;
  });

  effects: (() => void)[] = [];

  //style: FrameStyleType = $derived({
  style: FrameStyle = {
    isFoldedForm: true,
    dimension: 3,
    showVertices: false,
    transparentFaces: false,
  };

  constructor(models: Models) {
    this.#models = models;
    this.settings = new Settings();
    this.#makeLoadEffect();
    this.#makeStartLoopEffect();
    this.#makeFoldAmountEffect();
  }

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  get fold(): FOLD {
    return {
      vertices_coords: this.vertices_coords,
      edges_vertices: this.abstractGraph?.edges_vertices,
      edges_assignment: this.abstractGraph?.edges_assignment,
      edges_foldAngle: this.abstractGraph?.edges_foldAngle,
      faces_vertices: this.abstractGraph?.faces_vertices,
    };
  }

  // this is the solver loop, attach this to requestAnimationFrame
  computeLoopID: number | undefined;
  computeLoop(): void {
    this.computeLoopID = window.requestAnimationFrame(this.computeLoop.bind(this));
    this.settings.error = this.model?.solve(100);
    this.vertices_coords = this.model?.vertices_coords;
  }

  #makeStartLoopEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.computeLoopID) {
          window.cancelAnimationFrame(this.computeLoopID);
          this.computeLoopID = undefined;
        }
        if (this.settings.active) {
          console.log("starting simulator...");
          this.computeLoop.bind(this)();
        } else {
          console.log("stopping simulator");
        }
      });
      return (): void => {
        // empty
      };
    });
  }

  #makeLoadEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        try {
          this.model?.dealloc();
          this.model = new Model(this.inputFrame);
          this.settings.exportModel = this.model.export.bind(this.model);
          this.settings.reset = this.model.reset.bind(this.model);
          // edges and faces are built here and never change, only vertices need updating
          this.abstractGraph = {
            edges_vertices: this.model.fold.edges_vertices,
            edges_assignment: this.model.fold.edges_assignment,
            edges_foldAngle: this.model.fold.edges_foldAngle,
            faces_vertices: this.model.fold.faces_vertices,
          };
          this.vertices_coords = this.model.fold.vertices_coords;
        } catch (error) {
          console.error(error);
          window.alert(error);
        }
      });
      return (): void => {
        // empty
      };
    });
  }

  #makeFoldAmountEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        this.model.foldAmount = this.settings.foldAmount;
      });
      return () => {
        // empty
      };
    });
  }

  #makeStrainEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        //this.model.strain = this.settings.strain;
      });
      return () => {};
    });
  }

  dealloc(): void {
    this.effects.forEach((fn) => fn());
    console.log("dealloc simulator");
    if (this.computeLoopID) {
      window.cancelAnimationFrame(this.computeLoopID);
      this.computeLoopID = undefined;
    }
    this.model?.dealloc();
  }
}
