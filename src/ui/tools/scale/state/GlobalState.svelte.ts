
export class GlobalState {
  smartSnap: boolean = $state(true);
  toolOrigin: [number, number, number] = $state([0, 0, 0]);

  // empty
  dealloc(): void { }
}

