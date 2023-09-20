import jsTokens from "../lib/js-tokens/index.js";

export const parseToTokens = (js) => Array.from(jsTokens(js));

export const parseToMethodNames = (js) => parseToTokens(js)
	.filter(el => el.type === "IdentifierName")
	.map(el => el.value);

export const parseListToMethodNames = (strings) => strings
	.flatMap(parseToMethodNames);

// export const callIfIncluded = (commands, includedMethods) => (commands
// 	.flatMap(text => Array.from(jsTokens(text)))
// 	.filter(token => token.type === "IdentifierName")
// 	.map(token => token.value)
// 	.filter(value => includedMethods[value])
// 	.length > 0);

// export const callIfNotIncluded = (commands, includedMethods) => (commands
// 	.flatMap(text => Array.from(jsTokens(text)))
// 	.filter(token => token.type === "IdentifierName")
// 	.map(token => token.value)
// 	.filter(value => !includedMethods[value])
// 	.length > 0);
