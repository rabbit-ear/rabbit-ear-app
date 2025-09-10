import { pointInBoundingBox } from "rabbit-ear/math/encloses.js";
import type { Ruler } from "./Ruler.ts";
import type { Point } from "./Point.svelte.ts";

const filterNearestPoint = (points: Point[]) => {
  return points[0];
}

export class RulerManager {
  #rulers: Ruler[] = $state([]);

  get allRulers(): Ruler[] { return this.#rulers; }

  add(ruler: Ruler): void { this.#rulers.push(ruler); }

  // "padding" in all of these functions helps to define a fuzzy area
  // around an input point perfect for user-interfaces where the input
  // is not precise, allowing a user to "click" on a ruler and it still
  // successfully return that ruler even if it's a bit off.

  shapesAtPoint(point: [number, number], padding: number): Ruler[] {
    return this.#rulers
      .map(ruler => ({ ruler, bounds: ruler.makeBounds(padding) }))
      .filter(el => el.bounds !== undefined)
      .filter(el => pointInBoundingBox(point, el))
      .map(el => el.ruler);
  }

  peekPointAt(point: [number, number], padding: number): Ruler | undefined {
    const points = this.shapesAtPoint(point, padding)
      .filter(ruler => ruler.constructor.name === "Point"
        || ruler.constructor.name === "Intersection");
    return points.length < 2 ? points[0] : filterNearestPoint(points);
  }

  // createPointAt(x: number, y: number): Ruler {
  //   // attempt to find an intersection around this area
  // }
  //
  // selectOrCreatePointAt(point: [number, number], padding: number): Ruler {
  //   const overlapping = this.shapesAtPoint(point, padding);
  //
  // }
}

