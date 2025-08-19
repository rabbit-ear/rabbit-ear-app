export class GlobalState {
  dealloc(): void { }

  nearestVertex: object | undefined = $state(undefined);
  nearestEdge: object | undefined = $state(undefined);
  nearestFace: object | undefined = $state(undefined);
  locked: object | undefined = $state(undefined);

  lock() {
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
