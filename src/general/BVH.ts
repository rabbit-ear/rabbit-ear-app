import { MinHeap } from "./MinHeap.ts";

export type AABB = { min: [number, number]; max: [number, number] };

// compute the minimum distance from a point to the nearest point on
// an AABB. if the point is inside this will return 0.
const distancePointToAABB = (p: [number, number], box: AABB): number => {
  // each axis will compute the distance to left wall, and right wall,
  // and if both are negative use 0, which means the coord is
  // inside the box along that one axis.
  const dx = Math.max(box.min[0] - p[0], 0, p[0] - box.max[0]);
  const dy = Math.max(box.min[1] - p[1], 0, p[1] - box.max[1]);
  return Math.sqrt(dx * dx + dy * dy);
}

class BVHNode<T> {
  // this box contains all the left and right childrens' boxes.
  box: AABB;

  // only the leaves will have primitives
  primitives: T[];

  left?: BVHNode<T>;
  right?: BVHNode<T>;

  get isLeaf() { return !this.left && !this.right; }

  constructor(box: AABB, primitives: T[] = []) {
    this.box = box;
    this.primitives = primitives;
  }
}

export class BVH2D<T> {
  root: BVHNode<T> | undefined = undefined;
  #boundingBox: (primitive: T) => AABB;
  #distanceToPoint: (primitive: T, p: [number, number]) => number;

  constructor(
    primitives: T[],
    boundingBox: (primitive: T) => AABB,
    distanceToPoint: (primitive: T, p: [number, number]) => number
  ) {
    this.#boundingBox = boundingBox;
    this.#distanceToPoint = distanceToPoint
    this.root = this.#build(primitives);
  }

  // recursive build. given a list of primitives, create a node
  // with bounds that enclose all of the primitives
  // pass the primitives down the tree, if this node is not
  // a leaf node do not store any primitives rather the bounding
  // box exists to represent the space inhabited by the primitives
  // in all the leaves below this node.
  #build(primitives: T[]): BVHNode<T> | undefined {
    if (primitives.length === 0) return undefined;

    const min: [number, number] = [Infinity, Infinity];
    const max: [number, number] = [-Infinity, -Infinity];

    primitives.forEach(primitive => {
      const b = this.#boundingBox(primitive);
      min[0] = Math.min(min[0], b.min[0]);
      min[1] = Math.min(min[1], b.min[1]);
      max[0] = Math.max(max[0], b.max[0]);
      max[1] = Math.max(max[1], b.max[1]);
    });

    // temporarily assign all of the primitives to this node
    const node = new BVHNode<T>({ min, max }, primitives);

    // exit recursion
    if (primitives.length <= 2) { return node; }

    // figure out the longest axis, we will split along this
    const dx = max[0] - min[0];
    const dy = max[1] - min[1];
    const axis = dx > dy ? 0 : 1;
    const mid = (min[axis] + max[axis]) / 2;

    // this is the custom "boundingBox" function that you have to
    // define for the templated type.
    // split the primitives into two lists and recurse with each list.
    const left = primitives
      .filter(primitive => this.#boundingBox(primitive).min[axis] <= mid);
    const right = primitives
      .filter(primitive => this.#boundingBox(primitive).max[axis] >= mid);

    // bad split. exit recursion
    if (left.length === primitives.length || right.length === primitives.length) {
      return node;
    }

    node.left = this.#build(left);
    node.right = this.#build(right);

    // primitives are only set in a leaf node, and this is no longer a leaf node
    node.primitives = [];
    return node;
  }

  // query nearest primitive
  nearest(p: [number, number]): (T & { dist: number }) | undefined {
    if (!this.root) return undefined;
    let best: (T & { dist: number }) | undefined = undefined;

    // const time = performance.now();

    const heap = new MinHeap<BVHNode<T>>();
    heap.push(distancePointToAABB(p, this.root.box), this.root);

    while (heap.length > 0) {
      const { k: dist, v: node } = heap.pop()!;
      // prune
      if (best && dist > best.dist) { continue; }

      if (node.isLeaf) {
        for (const primitive of node.primitives) {
          const d = this.#distanceToPoint(primitive, p);
          if (!best || d < best.dist) {
            best = { ...primitive, dist: d };
          }
        }
      } else {
        if (node.left) {
          heap.push(distancePointToAABB(p, node.left.box), node.left);
        }
        if (node.right) {
          heap.push(distancePointToAABB(p, node.right.box), node.right);
        }
      }
    }

    // const end = performance.now();
    // console.log(`nearest: ${end - time}ms`);

    return best;
  }
}

