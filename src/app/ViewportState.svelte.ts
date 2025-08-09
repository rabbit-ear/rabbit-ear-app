export interface FrameViewState {
  viewMatrix: number[];
}

export interface ViewportStateType {
  id?: string;
  type?: string;
  model?: string;
  projection?: string;
  viewMatrix?: number[];
  projectionMatrix?: number[];
  frames?: FrameViewState[];
};

const defaultViewportState = (): ViewportStateType => ({
  id: String(Math.random()),
  type: "svg",
  model: "cp",
  projection: "orthographic",
  viewMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  projectionMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
})

export class ViewportState {
  id: string = $state(String(Math.random()));
  type: string = $state("svg");
  model: string = $state("cp");
  projection: string = $state("orthographic");
  viewMatrix: number[] = $state([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  projectionMatrix: number[] = $state([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  #populateData(state: ViewportStateType) {
    if (state.id) { this.id = state.id; }
    if (state.type) { this.type = state.type; }
    if (state.model) { this.model = state.model; }
    if (state.projection) { this.projection = state.projection; }
    if (state.viewMatrix) { this.viewMatrix = state.viewMatrix; }
    if (state.projectionMatrix) { this.projectionMatrix = state.projectionMatrix; }
  }

  constructor(viewport?: ViewportStateType) {
    this.#populateData(defaultViewportState());
    if (viewport) { this.#populateData(viewport); }
  }
}

