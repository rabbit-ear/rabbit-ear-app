import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Box } from "rabbit-ear/types.js";
import type { Shape } from "./Shape.ts";

export class Point implements Shape {
  // coords: [number, number] = $state() as unknown as [number, number];
  coords: [number, number] | undefined = $state();

  // dependencies: Shape[] = [];
  // dependents: Shape[] = $state([]);
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

