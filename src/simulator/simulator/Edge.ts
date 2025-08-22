/**
 * Created by ghassaei on 9/16/16.
 */
import type { Node } from "./Node.ts";
import type { SolverOptions } from "./GPUMath.ts";
import { magnitude, subtract } from "../general/math.ts";

export class Edge {
  type: string;
  axialStiffness: number;
  dampingRatio: number;
  vertices: [[number, number, number], [number, number, number]];
  nodes: [Node, Node];
  originalLength: number;

  constructor(nodes: [Node, Node], { axialStiffness, dampingRatio }: SolverOptions) {
    this.type = "beam";
    this.axialStiffness = axialStiffness;
    this.dampingRatio = dampingRatio;

    this.vertices = [nodes[0].originalPosition, nodes[1].originalPosition];
    this.nodes = nodes;
    this.originalLength = this.getLength();
    nodes[0].edges.push(this);
    nodes[1].edges.push(this);
  }

  getVector(): [number, number, number] {
    return subtract(this.vertices[1], this.vertices[0]);
  }

  /** distance between the original position of the two nodes */
  getLength(): number {
    return magnitude(this.getVector());
  }

  isFixed(): boolean {
    return this.nodes[0].fixed && this.nodes[1].fixed;
  }

  // dynamic solve
  getK(): number {
    return this.axialStiffness / this.getLength();
  }

  getD(): number {
    return this.dampingRatio * 2 * Math.sqrt(this.getK() * this.getMinMass());
  }

  getNaturalFrequency(): number {
    return Math.sqrt(this.getK() / this.getMinMass());
  }

  getMinMass(): number {
    let minMass = this.nodes[0].simMass;
    if (this.nodes[1].simMass < minMass) minMass = this.nodes[1].simMass;
    return minMass;
  }

  /** given a node in this beam, get the other node */
  getOtherNode(node: Node): Node {
    if (this.nodes[0] === node) return this.nodes[1];
    return this.nodes[0];
  }

  // deallocate
  destroy(): void {
    const that = this;
    this.nodes.forEach((node) => {
      const index = node.edges.indexOf(that);
      if (index >= 0) node.edges.splice(index, 1);
    });
    this.vertices = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.nodes = undefined;
  }
}
