import { pointInBoundingBox } from "rabbit-ear/math/encloses.js";
import type { Shape } from "./Shape.ts";

const filterNearestPoint = (points: Point) => {
  return points[0];
}

export class ShapeManager {
  #shapes: Shape[] = $state([]);

  get shapes(): Shape[] { return this.#shapes; }

  addShape(shape: Shape): void { this.#shapes.push(shape); }

  // "padding" in all of these functions helps to define a fuzzy area
  // around an input point perfect for user-interfaces where the input
  // is not precise, allowing a user to "click" on a shape and it still
  // successfully return that shape even if it's a bit off.

  shapesAtPoint(point: [number, number], padding: number): Shape[] {
    return this.#shapes
      .map(shape => ({ shape, bounds: shape.makeBounds(padding) }))
      .filter(el => el.bounds !== undefined)
      .filter(el => pointInBoundingBox(point, el))
      .map(el => el.shape);
  }

  peekPointAt(point: [number, number], padding: number): Shape | undefined {
    const points = this.shapesAtPoint(point, padding)
      .filter(shape => shape.constructor.name === "Point"
        || shape.constructor.name === "Intersection");
    return points.length < 2 ? points[0] : filterNearestPoint(points);
  }

  // createPointAt(x: number, y: number): Shape {
  //   // attempt to find an intersection around this area
  // }
  //
  // selectOrCreatePointAt(point: [number, number], padding: number): Shape {
  //   const overlapping = this.shapesAtPoint(point, padding);
  //
  // }
}

