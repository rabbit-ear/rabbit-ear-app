import type { FOLD, Box } from "rabbit-ear/types.d.ts";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { untrack } from "svelte";
import type { SolverOptions } from "./simulator/GPUMath.ts";
import type { Models } from "../model/Models.svelte.ts";
import { Model } from "./simulator/Model.ts";
import Settings from "./Settings.svelte.ts";

export class Simulator {
  #models: Models;
  model: Model;
  options: SolverOptions;

  graph: FOLD = $derived.by(() => this.#models.frameFlat);

  abstractGraph: FOLD;
  vertices_coords: [number, number, number][] = $state.raw([]);
  modelSize: number = $state(1);

  effects: (() => void)[] = [];

  constructor(models: Models) {
    this.#models = models;
    // this is disabling the simulator for now
    //this.effects = [
    //  this.#makeStartLoopEffect(),
    //  this.#makeLoadEffect(),
    //  this.#makeFoldAmountEffect(),
    //  //this.#makeStrainEffect(),
    //];
  }

  load(fold: FOLD): void {
    this.model = new Model(fold, this.options);
  }

  // this is the solver loop, attach this to requestAnimationFrame
  computeLoopID: number | undefined;
  computeLoop(): void {
    this.computeLoopID = window.requestAnimationFrame(this.computeLoop.bind(this));
    Settings.error = this.model?.solve(100);
    this.vertices_coords = this.model?.vertices_coords;
  }

  //startLoop(): void {
  //  if (this.computeLoopID) {
  //    window.cancelAnimationFrame(this.computeLoopID);
  //    this.computeLoopID = undefined;
  //  }
  //  if (Settings.active) {
  //    this.computeLoop();
  //  }
  //  this.computeLoop();
  //}

  #makeStartLoopEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.computeLoopID) {
          window.cancelAnimationFrame(this.computeLoopID);
          this.computeLoopID = undefined;
        }
        if (Settings.active) {
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
        const fold = this.graph;
        let box: Box | undefined;
        untrack(() => {
          try {
            this.model?.dealloc();
            this.model = new Model(fold);
            box = boundingBox(fold);
            Settings.exportModel = this.model.export.bind(this.model);
            Settings.reset = this.model.reset.bind(this.model);
            // edges and faces are built here and never change, only vertices need updating
            //this.abstractGraph = structuredClone(this.model.fold);
            //this.vertices_coords = structuredClone(this.model.fold.vertices_coords);
            this.abstractGraph = $state.snapshot(this.model.fold);
            this.vertices_coords = $state.snapshot(this.model.fold.vertices_coords);
          } catch (error) {
            console.error(error);
            window.alert(error);
          }
        });
        if (box !== undefined) {
          this.modelSize = box ? Math.max(...box.span) : 1;
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
        this.model.foldAmount = Settings.foldAmount;
      });
      return () => {
        // empty
      };
    });
  }

  #makeStrainEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        //this.model.strain = Settings.strain;
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
