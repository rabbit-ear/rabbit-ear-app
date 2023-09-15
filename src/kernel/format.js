import jsTokens from "../lib/js-tokens/index.js";
/**
 *
 */
export const formatJavascript = (text) => {
	const tokens = Array.from(jsTokens(text));
	console.log("tokens", tokens);
	const htmlString = tokens
		.map(token => `<span class=${token.type}>${token.value}</span>`)
		.join("");
	return htmlString;
};
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
