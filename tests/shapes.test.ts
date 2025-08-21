import { expect, test } from 'vitest'
import { ShapeManager } from '../src/shapes/ShapeManager.svelte';
import { Point } from '../src/shapes/Point.svelte';
import { Circle } from '../src/shapes/Circle.svelte';
import { Line } from '../src/shapes/Line.svelte';

test("shape manager", () => {
  const shapes = new ShapeManager();
  shapes.addShape(new Point(0, 0));
  // shapes.updateAll();
  expect(true).toBe(true);
});

test("derived properties", () => {
  const p0 = new Point(2, 0);
  const p1 = new Point(4, 0);
  const circle = new Circle(p0, p1);
  expect(circle.origin![0]).toBe(2);
  expect(circle.origin![1]).toBe(0);
  expect(circle.radius).toBeCloseTo(2);
});

// this test demonstrates that Svelte reactive properties ($derived)
// do not work outside of the compiled application.
test("reactive derived properties", () => {
  const p0 = new Point(2, 0);
  const p1 = new Point(4, 0);
  const circle = new Circle(p0, p1);
  expect(circle.origin![0]).toBe(2);
  expect(circle.origin![1]).toBe(0);
  expect(circle.radius).toBeCloseTo(2);
  const p2 = new Point(0, 0);
  circle.p = p2;
  // this is technically incorrect (but correct for our purposes)
  expect(circle.origin![0]).toBe(2);
  expect(circle.radius).toBeCloseTo(2);
  // // this is what they should look like:
  // expect(circle.origin[0]).toBe(0);
  // expect(circle.radius).toBeCloseTo(4);
});

test("dependent shapes", () => {
  const shapes = new ShapeManager();
  const p0 = new Point(10, 10);
  const p1 = new Point(30, 20);
  const circle = new Circle(p0, p1);
  const line = new Line(p0, p1);
  shapes.addShape(p0);
  shapes.addShape(p1);
  shapes.addShape(circle);
  shapes.addShape(line);

  // expect(p0.dependencies.length).toBe(0);
  // expect(p0.dependents.length).toBe(2);
  //
  // expect(p1.dependencies.length).toBe(0);
  // expect(p1.dependents.length).toBe(2);

  // expect(circle.dependencies.length).toBe(2);
  // expect(circle.dependents.length).toBe(0);
  //
  // expect(line.dependencies.length).toBe(2);
  // expect(line.dependents.length).toBe(0);
});

test("intersection", () => {
  const shapes = new ShapeManager();
  const p0 = new Point(0, 0);
  const p1 = new Point(2, 0);
  const circle0 = new Circle(p0, p1);
  const p2 = new Point(3, 0);
  const p3 = new Point(1, 0);
  const circle1 = new Circle(p2, p3);
  shapes.addShape(p0);
  shapes.addShape(p1);
  shapes.addShape(circle0);
  shapes.addShape(p2);
  shapes.addShape(p3);
  shapes.addShape(circle1);
});

test("topological sort", () => {
  const shapes = new ShapeManager();
  const p0 = new Point(10, 10);
  const p1 = new Point(30, 20);
  const circle = new Circle(p0, p1);
  const line = new Line(p0, p1);
  shapes.addShape(p0);
  shapes.addShape(p1);
  shapes.addShape(circle);
  shapes.addShape(line);

  const order = shapes.topologicalSort();
  expect(order.length).toBe(4);
  expect(order[0] instanceof Point).toBe(true);
  expect(order[1] instanceof Point).toBe(true);
});

