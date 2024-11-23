import type { FOLD } from "rabbit-ear/types.d.ts";
import type { IModel, Models } from "./Models.svelte.ts";
import type { ModelStyle } from "./ModelStyle.ts";
import type { Shape } from "../geometry/shapes.ts";
import app from "../app/App.svelte.ts";

export class SimulatorModel implements IModel {
  name: string = "simulator";
  #models: Models;

  constructor(models: Models) {
    this.#models = models;
  }

  //style: FrameStyleType = $derived({
  style: ModelStyle = {
    isFoldedForm: true,
    dimension: 3,
    showVertices: false,
    transparentFaces: false,
  };

  get shapes(): Shape[] {
    return this.#models.shapes;
  }

  get fold(): FOLD {
    return {
      vertices_coords: app.simulator.vertices_coords,
      edges_vertices: app.simulator.abstractGraph?.edges_vertices,
      edges_assignment: app.simulator.abstractGraph?.edges_assignment,
      edges_foldAngle: app.simulator.abstractGraph?.edges_foldAngle,
      faces_vertices: app.simulator.abstractGraph?.faces_vertices,
    };
  }
}
