import { scope } from "./scope.svelte.ts";

const shouldUseStrict = true;

// transfer all methods/constants from inside the "this."
// and into the top level of the scope.
const hoist = Object.keys(scope)
  .map((name) => `var ${name} = this.${name};`)
  .join("\n");

/**
 * @description run a Javascript blob in a context. In the case of an error,
 * error will be caught and returned, not thrown.
 * @param {string} jsBlob a snippet of Javascript code to be run
 * @param {object} scope the context to be bound to the function
 * @returns {any} whatever the Javascript code was meant to return
 * which, if the Javascript contains multiple lines of code, the return
 * object will be whatever the final line of code returns, or
 * "undefined" if nothing is returned.
 */
const scopedEval = (jsBlob: string, scope: object): any => {
  const line0 = shouldUseStrict ? '"use strict";' : ";";
  // const fileString = files
  // 	.map(f => `var ${f.name} = this.${f.name};`).join("");
  // hoist = hoist + fileString;
  try {
    return Function(`${line0} ${hoist}; return (${jsBlob})`).bind(scope)();
  } catch (e) {
    try {
      return Function(`${line0} ${hoist}; ${jsBlob}`).bind(scope)();
    } catch (error) {
      return error;
    }
  }
};

/**
 * @description This is the main point of entry to execute
 * a command in the context that contains all the app's functionality.
 * The command will pass through the app's Injections, be executed,
 * then print the output to the console.
 * @param {string} js a valid Javascript blob
 * @returns {any} whatever is the result of executing the javascript
 */
export const execute = (js: string): object[] => scopedEval(js, scope);

// // injections might work this way
// export const execute = (js: string) => {
// 	const commands = [js];
// 	get(Injections).forEach((injection) => injection.execute(commands));
// 	// add to the undo stack. clear the redo stack
// 	return commands.flatMap((command) => scopedEval(command, scope));
// };
