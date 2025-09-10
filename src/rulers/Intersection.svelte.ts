import type { Box } from "rabbit-ear/types.js";
import type { Ruler } from "./Ruler.ts";
import type { Point } from "./Point.svelte.ts";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import { intersect } from "./intersections/intersect.ts";

export class Intersection implements Point, Ruler {
  a: Ruler = $state() as unknown as Ruler;
  b: Ruler = $state() as unknown as Ruler;
  // which index in the results array
  index: number = $state(0);

  results: [number, number][] = $derived(this.a.defined && this.b.defined
    ? intersect(this.a, this.b)
    : []);

  coords: [number, number] | undefined = $derived(this.results[this.index] ?? this.results[0]);

  dependencies: Ruler[] = $state([]);
  dependents: Ruler[] = $state([]);
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

  constructor(a: Ruler, b: Ruler, index: number) {
    this.a = a;
    this.b = b;
    this.index = index;
    this.dependencies = [a, b];
  }
}

