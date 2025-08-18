export type Shape = {
  dependencies: Shape[];
  compute: () => void;
} | [number, number]

// export abstract class Shape {
//   abstract dependencies: Shape[];
//   abstract compute(): void;
// }

