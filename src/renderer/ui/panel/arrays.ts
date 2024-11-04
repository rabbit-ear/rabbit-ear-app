// compares their constructors with ===
export const uniqueObjects = <T>(objs: T[]): T[] => {
  const result: T[] = [];
  objs.forEach((view, a) => {
    for (let b = 0; b < a; b += 1) {
      if (view.constructor === objs[b].constructor) {
        return;
      }
    }
    result.push(view);
  });
  return result;
};
