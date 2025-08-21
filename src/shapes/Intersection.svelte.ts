import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Box } from "rabbit-ear/types.js";
import type { Shape } from "./Shape.ts";
import type { Point } from "./Point.svelte.ts";
import { intersect } from "./intersections/intersect.ts";

export class Intersection implements Point, Shape {
  a: Shape = $state() as unknown as Shape;
  b: Shape = $state() as unknown as Shape;
  // which index in the results array
  index: number = $state(0);

  results: [number, number][] = $derived(this.a.defined && this.b.defined
    ? intersect(this.a, this.b)
    : []);

  coords: [number, number] | undefined = $derived(this.results[this.index] ?? this.results[0]);

  dependencies: Shape[] = $state([]);
  dependents: Shape[] = $state([]);
  defined: boolean = $derived(this.coords !== undefined);

  makeBounds(padding: number): Box | undefined {
    return this.defined && this.coords
      ? boundingBox([this.coords], padding)
      : undefined;
  }

  // compute(): void {
  //   const results = intersect(this.a, this.b);
  //   this.coords = results[this.index];
  // }

  constructor(a: Shape, b: Shape, index: number) {
    this.a = a;
    this.b = b;
    this.index = index;
    this.dependencies = [a, b];
  }
}

