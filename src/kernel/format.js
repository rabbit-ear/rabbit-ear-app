import jsTokens from "../lib/js-tokens/index.js";
/**
 * @description Convert a Javascript snippet into a HTML string
 * after processing it into tokens, wrapping each part in a span
 * element marked with the class name of the token type.
 * @returns {string} HTML string
 */
const formatJavascript = (js) => Array
	.from(jsTokens(js))
	.map(({ type, value }) => `<span class=${type}>${value}</span>`)
	.join("");
/**
 * @description Convert a Javascript variable into an HTML string
 * in one span element, with a class of "return".
 * @returns {string} HTML string
 */
const formatCommandResult = (result) => {
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
 * @description Convert an error or a string into an HTML string
 * with one span marked class of "error".
 * @returns {string} HTML string
 */
const formatError = (error) => (
	`<span class="error">${error}</span>`
);

export const terminalOutputJavascript = (js) => {
	const tokens = Array.from(jsTokens(js));
	const commands = tokens
		.filter(el => el.type === "IdentifierName")
		.map(el => el.value);
	const html = tokens
		.map(({ type, value }) => `<span class=${type}>${value}</span>`)
		.join("");
	return { html, commands };
};

export const terminalOutputError = (error) => ({
	html: `<span class="error">${error}</span>`,
});

export const terminalOutputCommandResult = (result) => ({
	html: formatCommandResult(result),
});
