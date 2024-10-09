/**
 *
 */
export const matchFromArray = (matchString: string, array: string[]): string[] => {
  const matches: string[] = [];
  for (const str of array) {
    const regex = new RegExp(`\\b${str}\\b`, "g");
    if (regex.test(matchString)) {
      matches.push(str);
    }
  }
  return matches;
};
