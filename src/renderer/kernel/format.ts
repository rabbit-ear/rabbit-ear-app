import jsTokens from "js-tokens";

/**
 * @description Maximum string length in terminal
 */
const MAX_LENGTH = 150;

/**
 *
 */
export const stringifyArgs = (...args: unknown[]): string =>
  `${args.map((v) => JSON.stringify(v)).join(", ")}`;

/**
 * @description Convert a Javascript snippet into a HTML string
 * after processing it into tokens, wrapping each part in a span
 * element marked with the class name of the token type.
 */
export const formatJavascript = (js: string): string =>
  Array.from(jsTokens(js))
    .map(({ type, value }) => `<span class=${type}>${value}</span>`)
    .join("");

/**
 * @description clip extremely long commands,
 * like load() with an 1mg json argument.
 */
const capLength = (str: string): string =>
  str.length > MAX_LENGTH ? `${str.slice(0, MAX_LENGTH)}...` : str;

/**
 * @description Convert a Javascript variable into an HTML string
 * in one span element, with a class of "return".
 */
export const formatCommandResult = (result: unknown): string | undefined => {
  if (result == null) {
    return undefined;
  }
  switch (typeof result) {
    case "boolean":
      return `${result}`;
    case "number":
      return `${result}`;
    case "string":
      return capLength(result);
    case "object":
      return capLength(JSON.stringify(result));
    case "function":
      return result.name || "Function";
  }
  return undefined;
};

/**
 * @description Given a reference string to match against, iterate through an array
 * of strings and return an array item which appears anywhere inside of the reference string.
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
