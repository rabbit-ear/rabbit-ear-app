import type { Box } from "rabbit-ear/types.js";

export type Shape = {
  // id: number;
  // dependencies: Shape[];
  // dependents: Shape[];
  defined: boolean;

  makeBounds(padding: number): Box | undefined;
  // compute: () => void;
};

