import type { Shape } from "./Shape";
import { intersect } from "./intersections/intersect.ts";

export class Intersection {
  a: Shape;
  b: Shape;

  results: [number, number][] = $derived
    .by(() => intersect(this.a, this.b));

  dependencies: Shape[] = $state([]);

  constructor(a: Shape, b: Shape) {
    this.a = a;
    this.b = b;
    this.dependencies = [a, b];
  }
}
