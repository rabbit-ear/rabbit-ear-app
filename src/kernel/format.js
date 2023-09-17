import jsTokens from "../lib/js-tokens/index.js";
/**
 *
 */
export const formatJavascript = (text) => Array
	.from(jsTokens(text))
	.map(({ type, value }) => `<span class=${type}>${value}</span>`)
	.join("");
/**
 *
 */
export const formatCommandResult = (result) => {
	if (result == null) { return undefined; }
	const prompt = `<span class="prompt-symbol">&gt;</span>`;
	switch (typeof result) {
	case "boolean": return `${prompt} <span class="return">${result}</span>`;
	case "number": return `${prompt} <span class="return">${result}</span>`;
	case "string": return `${prompt} <span class="return">${result}</span>`;
	case "object": return `${prompt} <span class="return">${JSON.stringify(result)}</span>`;
	case "function": break;
	}
	return undefined;
};
/**
 *
 */
export const formatError = (error) => (
	`<span class="error">${error}</span>`
);
