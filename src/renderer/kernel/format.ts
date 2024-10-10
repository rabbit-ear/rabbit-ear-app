import jsTokens from "js-tokens";

/**
 * @description Maximum string length in terminal
 */
const MAX_LENGTH = 150;

/**
 * @description Convert a Javascript snippet into a HTML string
 * after processing it into tokens, wrapping each part in a span
 * element marked with the class name of the token type.
 * @returns {string} HTML string
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
 *
 */
const stringifyAny = (el: unknown): string => {
  if (el == null) {
    return "";
  }
  switch (typeof el) {
    case "boolean":
      return `${el}`;
    case "number":
      return `${el}`;
    case "string":
      return `${capLength(el)}`;
    case "object":
      return `${capLength(JSON.stringify(el))}`;
    case "function":
      break;
  }
  return "";
};

/**
 * @description Convert a Javascript variable into an HTML string
 * in one span element, with a class of "return".
 * @returns {string} HTML string
 */
// const formatCommandResult = (result: any): string|undefined => {
// 	if (result == null) {
// 		return undefined;
// 	}
// 	const prompt = `<span class="prompt-symbol">&gt;</span>`;
// 	switch (typeof result) {
// 		case "boolean":
// 			return `${prompt} <span class="return">${result}</span>`;
// 		case "number":
// 			return `${prompt} <span class="return">${result}</span>`;
// 		case "string":
// 			return `${prompt} <span class="return">${capLength(result)}</span>`;
// 		case "object":
// 			return `${prompt} <span class="return">${capLength(JSON.stringify(result))}</span>`;
// 		case "function":
// 			break;
// 	}
// 	return undefined;
// };
export const formatCommandResult = (result: unknown): string | undefined => {
  if (result == null) {
    return undefined;
  }
  // &gt;
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
      break;
  }
  return undefined;
};
