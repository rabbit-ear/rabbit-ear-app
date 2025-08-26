export class GlobalState {
  dealloc(): void { }

  nearestVertex: object | undefined = $state(undefined);
  nearestEdge: object | undefined = $state(undefined);
  nearestFace: object | undefined = $state(undefined);
  locked: object | undefined = $state(undefined);

  lock() {
    // todo: locked needs to unlock when the embedding's graph changes,
    // when the user switches tabs for example, and a new model is loaded,
    // we are potentially "locked" onto a v/e/f that doesn't exist.
    this.locked = {
      vertex: $state.snapshot(this.nearestVertex),
      edge: $state.snapshot(this.nearestEdge),
      face: $state.snapshot(this.nearestFace),
    };
  }

  unlock(): void {
    this.locked = undefined;
  }
}
