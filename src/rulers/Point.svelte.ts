import type { Box } from "rabbit-ear/types.js";
import type { Ruler } from "./Ruler.ts";
import { boundingBox } from "rabbit-ear/math/polygon.js";

export class Point implements Ruler {
  // coords: [number, number] = $state() as unknown as [number, number];
  coords: [number, number] | undefined = $state();

  // dependencies: Ruler[] = [];
  // dependents: Ruler[] = $state([]);
  defined: boolean = true;

  makeBounds(padding: number): Box | undefined {
    return this.coords
      ? boundingBox([this.coords], padding)
      : undefined;
  }

  // compute(): void { }

  // constructor(coords: [number, number]) {
  constructor(coords: [number, number]) {
    this.coords = [...coords];
  }

  static zero() { return new Point([0, 0]); }
}

