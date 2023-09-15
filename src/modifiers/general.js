import jsTokens from "../lib/js-tokens/index.js";

export const callIfIncluded = (commands, includedMethods) => (commands
	.flatMap(text => Array.from(jsTokens(text)))
	.filter(token => token.type === "IdentifierName")
	.map(token => token.value)
	.filter(value => includedMethods[value])
	.length > 0);

export const callIfNotIncluded = (commands, includedMethods) => (commands
	.flatMap(text => Array.from(jsTokens(text)))
	.filter(token => token.type === "IdentifierName")
	.map(token => token.value)
	.filter(value => !includedMethods[value])
	.length > 0);
