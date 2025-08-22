/**
 * @description Given a number (N) find the largest number (x) which satisfies:
 * N < Pow(x, 2)
 * For example, the next nearest power of two from 1000 is 1024, so 32 is returned
 */
export const fitToPow2 = (numNodes: number): number => {
  if (numNodes === 1) return 2;
  for (let i = 0; i < numNodes; i += 1) {
    if (2 ** (2 * i) >= numNodes) {
      return 2 ** i;
    }
  }
  if (numNodes !== 0) {
    console.warn(`no texture size found for ${numNodes} items`);
  }
  return 2;
};
