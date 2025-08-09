import type { FOLD } from "rabbit-ear/types.d.ts";
import { ViewportState, type ViewportStateType } from "./ViewportState.svelte";

export interface SceneStateType {
  tool?: string;
  viewports?: ViewportStateType[],
  settings?: {
    grid?: boolean;
  }
}

const defaultSceneState = (): SceneStateType => ({
  tool: "ui.tools.select",
  viewports: [{
    id: String(Math.random()),
    type: "SVGViewport",
    model: "cp",
    viewMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    projection: "orthographic",
    projectionMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  }, {
    id: String(Math.random()),
    type: "SVGViewport",
    model: "folded",
    viewMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    projection: "orthographic",
    projectionMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  }],
  settings: {
    grid: true,
  }
});

export class SceneState {
  activeTool: string = $state("ui.tools.select");
  // viewportLayout: string = $state("2-cp-folded")
  viewports: ViewportState[] = $state([]);
  settings = $state({ grid: true });

  #populateData(scene: SceneStateType) {
    if (scene.tool) { this.activeTool = scene.tool; }
    if (scene.viewports) {
      this.viewports = scene.viewports.map(viewport => new ViewportState(viewport));
    }
    if (scene.settings) { this.settings = scene.settings; }
  }

  constructor(sceneState?: SceneStateType) {
    this.#populateData(defaultSceneState());
    if (sceneState) { this.#populateData(sceneState); }
  }

  static get empty(): SceneState {
    return new SceneState();
  }

  static getSceneFromFOLD(fold: FOLD): SceneStateType | undefined {
    // todo: if fold entry does not exist, generate entries which
    // best fit the model, for example the view matrix
    return fold["ear:sceneState"] as SceneStateType | undefined;
  }
}
