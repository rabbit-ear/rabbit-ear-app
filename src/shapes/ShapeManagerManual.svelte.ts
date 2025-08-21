import type { Shape } from "./Shape.ts";

export class ShapeManager {
  #shapes: Shape[] = $state([]);

  // addShape(shape: Shape): number {
  addShape(shape: Shape): void {
    // shape.id = this.#shapes.length;
    this.#shapes.push(shape);
    shape.dependencies
      .forEach(dependency => dependency.dependents.push(shape));
    // return shape.id;
  }

  updateFrom(shape: Shape): void {
    shape.dependents.forEach((dependent) => {
      dependent.compute();
      this.updateFrom(dependent);
    });
  }

  updateAll(): void {
    this.topologicalSort().forEach(shape => shape.compute());
  }

  topologicalSort(): Shape[] {
    const visited = new Set<Shape>();
    const result: Shape[] = [];

    const dfs = (shape: Shape): void => {
      if (visited.has(shape)) { return; }
      visited.add(shape);
      shape.dependencies.forEach(dfs);
      result.push(shape);
    };

    this.#shapes.forEach(dfs);
    return result;
  }
}

